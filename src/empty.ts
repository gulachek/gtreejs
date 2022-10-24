import { ITreeable } from './encoding';
import { IEncodedTree, IDecodableTree } from './tree';

export const Empty: ITreeable<null> = {
	gtreeEncode(val?: null): IEncodedTree
	{
		return {value:new Uint8Array(), children:[]};
	},

	gtreeDecode(tr: IDecodableTree): null
	{
		return null;
	}
};
