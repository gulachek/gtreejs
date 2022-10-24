import { Readable } from 'node:stream';
import { IEncodedTree } from './tree';

function encodeBase128(n: number): Buffer
{
	const a: number[] = [];

	while (n >= 128) {
		const b = n & 0x7f;
		a.push(b | 0x80);
	}

	a.push(n);
	return Buffer.from(a);
}

function joinTree(tr: IEncodedTree, a: Buffer[]): void
{
	a.push(encodeBase128(tr.value.length));
	a.push(Buffer.from(tr.value)); // TODO copy should be eliminated
	a.push(encodeBase128(tr.children.length));

	for (const child of tr.children) {
		joinTree(child, a);
	}
}

export function encodeTree(tr: IEncodedTree): Buffer
{
	const a: Buffer[] = [];
	joinTree(tr, a);
	return Buffer.concat(a);
}

export class TreeWriter extends Readable
{
	#treeQueue: IEncodedTree[];
	#isReadRequested: boolean;
	#isComplete: boolean;
	#destroyCb: Function;

	constructor() {
		super();
		this.#treeQueue = [];
		this.#isReadRequested = false;
		this.#isComplete = false;
	}

	write(tr: IEncodedTree): void
 	{
		this.#treeQueue.push(tr);
		this.#tryPush();
	}

	done(): void
	{
		// I don't know why but there are really weird and poorl documented
		// timing interactions for destroying a stream that is being piped
		// in the same callstack where the connected reader doesn't get any
		// notifications about the thing it's trying to read from being
		// destroyed
		setTimeout(this.destroy.bind(this), 0);
	}

	get #hasError(): boolean
	{
		return this.#isComplete && !this.#destroyCb;
	}

	get #canPushData(): boolean
	{
		return this.#isReadRequested && this.#treeQueue.length > 0;
	}

	_read(size: number): void
 	{
		console.log('TreeWriter _read');
		this.#isReadRequested = true;
		this.#tryPush();
	}

	_destroy(err: Error | null, callback: Function): void
	{
		console.log('TreeWriter _destroy');
		this.#isComplete = true;

		if (err)
		{
			this.push(null);
			callback(err);
		}
		else
		{
			this.#destroyCb = callback;
			this.#tryPush();
		}

	}

	#tryPush(): void
	{
		if (this.#hasError)
			return;

		if (!(this.#isComplete || this.#canPushData)) {
			return;
		}

		if (this.#canPushData)
		{
			console.log('TreeWriter pushing data');
			this.push(encodeTree(this.#treeQueue.shift()));
		}
		else
		{
			console.log('TreeWriter pushing null');
			this.push(null);
			// this is ridiculous. documentation on how to call destroy callback
			// doesn't exist at time of writing and calling destroy in same
			// callstack as pipe()ing this stream to a writable gives writable
			// no information that this was destroyed if this is called in same
			// callstack.
			// https://nodejs.org/api/stream.html#readable_destroyerr-callback
			setTimeout(this.#destroyCb.bind(this, null));
		}

		this.#isReadRequested = false;
	}
}
