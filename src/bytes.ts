import { ITreeable } from './encoding';
import { EncodedValue, IEncodedTree, IDecodableTree } from './tree';

export const Bytes: ITreeable<EncodedValue> = {
	gtreeEncode(v: EncodedValue): IEncodedTree
 	{
		return { value: v, children: [] };
	},

	gtreeDecode(tr: IDecodableTree): EncodedValue
	{
		return Uint8Array.from(tr.value);
	}
};
