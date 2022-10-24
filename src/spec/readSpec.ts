import { expect } from 'chai';
import { ChunkyBuffer } from '../treeder';
import {
	readStreamTrees,
	readStreamTree,
	Treeder,
	writeStreamTree,
	TreeWriter,
	Utf8,
	Vector
} from '../index';

import { PassThrough } from 'node:stream';

describe('ChunkyBuffer', () => {
	let buf: ChunkyBuffer;

	beforeEach(() => {
		buf = new ChunkyBuffer();
	});

	it('begins as empty buffer', () => {
		expect(buf.length).to.equal(0);
		expect(buf.pos).to.equal(0);
	});

	it('grows by adding buffers', () => {
		buf.push(Buffer.from([1, 2, 3]));
		expect(buf.length).to.equal(3);

		buf.push(Buffer.from([4, 5, 6]));
		expect(buf.length).to.equal(6);
	});

	it('advances through buffer linearly', () => {
		buf.push(Buffer.from([1, 2, 3]));
		buf.push(Buffer.from([4, 5, 6]));

		const a = [];
		while (buf.pos < buf.length) {
			a.push(buf.next());
		}

		expect(a).to.deep.equal([1, 2, 3, 4, 5, 6]);
		expect(buf.pos).to.equal(6);
		expect(buf.length).to.equal(6);
	});

	it('consumes to position of buffer', () => {
		buf.push(Buffer.from([0, 1, 2]));
		buf.push(Buffer.from([3, 4, 5]));

		buf.seek(4);
		const a = Array.from(buf.consume());
		expect(a).to.deep.equal([0, 1, 2, 3]);
		expect(buf.pos).to.equal(0);
		expect(buf.length).to.equal(2);
		expect(buf.peek()).to.equal(4);
	});
});

describe('read/write', () => {
	it('reads hello world', async () => {
		const stream = new PassThrough();

		const readProm = readStreamTree(stream);
		await writeStreamTree(stream, Utf8.gtreeEncode('hello world'));
		const hello = Utf8.gtreeDecode(await readProm);
		expect(hello).to.equal('hello world');
	});

	it('reads hello + world', async () => {
		const w = new TreeWriter();
		w.write(Utf8.gtreeEncode('hello'));
		w.write(Utf8.gtreeEncode('world'));
		w.done();
		const trees = await readStreamTrees(w);
		const helloWorld = trees.map(tr => Utf8.gtreeDecode(tr));
		expect(helloWorld).to.deep.equal(['hello', 'world']);
	});

	it('reads a vector', async () => {
		const stream = new PassThrough();

		const enc = new Vector(Utf8);
		const readProm = readStreamTree(stream);
		await writeStreamTree(stream, enc.gtreeEncode(['hello','world']));
		const helloWorld = enc.gtreeDecode(await readProm);
		expect(helloWorld).to.deep.equal(['hello', 'world']);
	});
});
