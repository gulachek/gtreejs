import { TreeWriter } from './treeWriter';
export { TreeWriter } from './treeWriter';
import { IEncodedTree } from './tree';

import { Writable } from 'node:stream';
import * as fs from 'node:fs';

// convenience wrapper for dumping entire tree into writable
// this assumes that the writable ends after the tree
// if fine grained control of *not* ending the writable stream is needed,
// use a TreeWriter and pipe it to your stream as you see fit
export function writeStreamTree(w: Writable, tr: IEncodedTree): Promise<void>
{
	return new Promise((res, rej) => {
		w.on('close', res);
		w.on('error', rej);

		const tw = new TreeWriter();
		tw.pipe(w);
		tw.write(tr);
		tw.done();
	});
}

function makeStream(pathOrFd: string | number): Writable
{
	if (typeof pathOrFd === 'number')
		return fs.createWriteStream(null, { fd: pathOrFd });
	else if (typeof pathOrFd === 'string')
		return fs.createWriteStream(pathOrFd);
	else
		throw new Error(`Invalid path or fd ${pathOrFd}`);
}

export function writeTree(pathOrFd: string | number, tr: IEncodedTree): Promise<void>
{
	return writeStreamTree(makeStream(pathOrFd), tr);
}
