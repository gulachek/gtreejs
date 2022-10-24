import { ITreeable } from './encoding';
import { IEncodedTree, IDecodableTree } from './tree';

export class Vector<T> implements ITreeable<T[]>
{
	#elem: ITreeable<T>;

	constructor(elemEnc: ITreeable<T>)
	{
		this.#elem = elemEnc;
	}

	gtreeEncode(v: Iterable<T>): IEncodedTree
	{
		const children = [];

		for (const e of v)
			children.push(this.#elem.gtreeEncode(e));

		return {value: Uint8Array.from([]), children };
	}

	gtreeDecode(tr: IDecodableTree): T[]
	{
		const v = [];

		for (const c of tr.children)
			v.push(this.#elem.gtreeDecode(c));

		return v;
	}
}
