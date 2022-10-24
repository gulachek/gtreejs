import { ITreeable } from './encoding';
import { IEncodedTree, IDecodableTree } from './tree';

export const Unsigned: ITreeable<number> = {
	gtreeEncode(n: number): IEncodedTree
	{
		const val = [];

		while (n)
		{
			val.push(n & 0xff);
			n >>= 8;
		}

		return { value: Uint8Array.from(val), children: []};
	},

	gtreeDecode(tr: IDecodableTree): number
	{
		let n = 0;
		let shift = 0;

		for (const b of tr.value)
		{
			n |= (b << shift);
			shift += 8;
		}

		return n;
	}
};
