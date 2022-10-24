import { Treeder } from './treeder';
export { Treeder } from './treeder';

import { IEncodedTree } from './tree';

import { Readable } from 'node:stream';
import * as fs from 'node:fs';

export async function readStreamTrees(r: Readable): Promise<IEncodedTree[]>
{
	const treeder = new Treeder();
	const trees: IEncodedTree[] = [];

	treeder.on('tree', (tr: IEncodedTree) => {
		trees.push(tr);
	});

	return new Promise<IEncodedTree[]>((res, rej) => {
		treeder.on('end', res.bind(null, trees));
		treeder.on('error', rej);
		r.pipe(treeder);
	});
}

export async function readStreamTree(r: Readable): Promise<IEncodedTree>
{
	const trees = await readStreamTrees(r);
	if (trees.length !== 1)
		throw new Error(`Expected a single tree but read ${trees.length}`);

	return trees[0];
}

function createStream(pathOrFd: string | number): Readable
{
	if (typeof pathOrFd === 'number')
		return fs.createReadStream(null, { fd: pathOrFd });
	else if (typeof pathOrFd === 'string')
		return fs.createReadStream(pathOrFd);
	else
		throw new Error(`Invalid path or fd: ${pathOrFd}`);
}

export async function readTrees(pathOrFd: string | number): Promise<IEncodedTree[]>
{
	return readStreamTrees(createStream(pathOrFd));
}

export async function readTree(pathOrFd: string | number): Promise<IEncodedTree>
{
	return readStreamTree(createStream(pathOrFd));
}
