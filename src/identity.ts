import { ITreeable } from './encoding';
import { IEncodedTree, IDecodableTree } from './tree';

export const Identity: ITreeable<IEncodedTree> = {
	gtreeEncode(tr: IEncodedTree): IEncodedTree
	{
		return tr;
	},

	gtreeDecode(tr: IDecodableTree): IEncodedTree
	{
		const value = Uint8Array.from(tr.value);

		const children: IEncodedTree[] = [];
		for (const child of tr.children)
			children.push(Identity.gtreeDecode(child));

		return { value, children };
	}
};
