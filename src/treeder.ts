import { Writable } from 'node:stream';
import { EventEmitter } from 'node:events';
import { IEncodedTree } from './tree';

type Byte = number;
type Index = number;

export class ChunkyBuffer
{
	#chunks: Buffer[];
	#length: number;

	#chunkIndex: Index;
	#byteIndex: Index;
	#pos: Index;

	constructor()
	{
		this.#chunks = [];
		this.#length = 0;
		this.#pos = 0;
		this.#chunkIndex = 0;
		this.#byteIndex = 0;
	}

	push(chunk: Buffer): void
 	{
		this.#chunks.push(chunk);
		this.#length += chunk.length;
	}

	get pos(): Index
 	{
		return this.#pos;
	}

	get length(): number
 	{ return this.#length; }

	get #chunk(): Buffer
 	{ return this.#chunks[this.#chunkIndex]; }

	seek(n: Index): void
	{
		if (n > this.length) {
			throw new Error('out of bounds');
		}

		let size = 0;
		for (let i = 0; i < this.#chunks.length; ++i) {
			const chunk = this.#chunks[i];

			if (n < size + chunk.length) {
				this.#chunkIndex = i;
				this.#byteIndex = n - size;
				return;
			}

			size += chunk.length;
		}

		this.#chunkIndex = this.#chunks.length;
		this.#byteIndex = 0;
	}

	peek(): Byte
 	{
		return this.#chunk[this.#byteIndex];
	}

	next(): Byte
 	{
		const b = this.peek();

		++this.#pos;
		++this.#byteIndex;
		if (this.#byteIndex >= this.#chunk.length) {
			++this.#chunkIndex;
			this.#byteIndex = 0;
		}

		return b;
	}

	// grab everything before pos()
	consume(): Buffer
 	{
		const chunks = this.#chunks.slice(0, this.#chunkIndex);
		const newChunks = [];
		let newLength = 0;

		if (this.#byteIndex) {
			chunks.push(this.#chunk.slice(0, this.#byteIndex));
			newChunks.push(this.#chunk.slice(this.#byteIndex));
			newLength += newChunks[0].length;
		} else if (this.#chunk) {
			newChunks.push(this.#chunk);
			newLength += newChunks[0].length;
		}

		for (let i = this.#chunkIndex + 1; i < this.#chunks.length; ++i) {
			newChunks.push(this.#chunks[i]);
			newLength += this.#chunks[i].length;
		}

		this.#pos = 0;
		this.#chunkIndex = 0;
		this.#byteIndex = 0;
		this.#chunks = newChunks;
		this.#length = newLength;

		return Buffer.concat(chunks);
	}
}

function parseBase128(data: Buffer): number
{
	let n = 0;
	let power = 1;
	for (const b of data) {
		n += power * (b & 0x7f);
		power *= 128;
	}

	return n;
}

export class Treeder extends Writable
{
	#buf: ChunkyBuffer;
	#target: number;
	#isComplete: boolean;

	#res: Function | null;
	#rej: Function | null;

	constructor() {
		super();
		this.#buf = new ChunkyBuffer();
		this.#isComplete = false;
		this.#target = -1;
		this.once('pipe', this.#startEmitting.bind(this));
	}

	#read(n: number): Promise<Buffer | null>
	{
		this.#target = n;

		if (this.#res) {
			throw new Error('only one read at a time');
		}

		const p = new Promise<Buffer | null>((res, rej) => {
			this.#res = res;
			this.#rej = rej;
		});

		this.#tryRead();

		return p;
	}

	async #readTree(): Promise<IEncodedTree | null>
 	{
		const dataSizeBytes = await this.#read(-1);
		if (!dataSizeBytes) return null;

		const dataSize = parseBase128(dataSizeBytes);

		const dataBytes = await this.#read(dataSize);
		if (!dataBytes) throw new Error('value cannot be null');

		const childCountBytes = await this.#read(-1);
		if (!childCountBytes) throw new Error('child count bytes cannot be null');

		const childCount = parseBase128(childCountBytes);
		const children: IEncodedTree[] = [];

		for (let i = 0; i < childCount; ++i) {
			const child = await this.#readTree();
			if (!child) throw new Error('child cannot be null');
			children.push(child);
		}

		return { value: dataBytes, children };
	}

	async #startEmitting(): Promise<void>
	{
		while (!this.#isComplete) {
			try {
				const tr = await this.#readTree();
				if (tr) {
					this.emit('tree', tr);
				} else {
					if (!this.#isComplete) {
						this.emit('error', new Error('received null Tree. error in Treeder implementation'));
						return;
					}

					this.emit('end');
				}
			} catch (err) {
				this.emit('error', err);
			}
		}
	}

	_write(chunk: Buffer, encoding: string, callback: Function): void
	{
		this.#buf.push(chunk);
		this.#tryRead();
		callback();
	}

	_final(callback: Function): void
	{
		this.#isComplete = true;
		this.#tryRead();
		callback();
	}

	_destroy(err: Error, callback: Function): void
	{
		callback(err);
	}

	#tryRead(): void
 	{
		// check if read is in progress
		if (!this.#res) {
			return;
		}

		if (this.#target === -1) {
			// find unsigned high bit
			while (this.#buf.pos < this.#buf.length) {
				const b = this.#buf.next();
				if (b & 0x80) {
					continue;
				}

				this.#resolve(this.#buf.consume());
				return;
			}
		} else if (this.#target >= 0) {
			// read block of bytes
			if (this.#buf.length >= this.#target) {
				this.#buf.seek(this.#target);
				this.#resolve(this.#buf.consume());
				return;
			}
		}

		if (this.#isComplete) {
			this.#resolve(null);
		}
	}

	#clear(): void
 	{
		this.#res = null;
		this.#rej = null;
	}

	#resolve(val: Buffer | null): void
 	{
		this.#res(val);
		this.#clear();
	}
}
