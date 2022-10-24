import { ITreeable } from './encoding';
import { IEncodedTree, IDecodableTree } from './tree';

export const Utf8: ITreeable<string> = {
	gtreeEncode(s: string): IEncodedTree
 	{
		const e = new TextEncoder();
		return {value:e.encode(s), children:[]};
	},

	gtreeDecode(tr: IDecodableTree): string
 	{
		const d = new TextDecoder();
		return d.decode(new Uint8Array(tr.value));
	}
};
