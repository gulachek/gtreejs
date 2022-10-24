import { ITreeable } from './encoding';
import { IEncodedTree, IDecodableTree } from './tree';

export const Float32: ITreeable<number> = {
	gtreeEncode(f: number): IEncodedTree
	{
		const buf = new ArrayBuffer(4);
		const dv = new DataView(buf);
		dv.setFloat32(0, f, true);

		return {value:new Uint8Array(buf), children:[]};
	},

	gtreeDecode(tr: IDecodableTree): number
 	{
		const arr = Uint8Array.from(tr.value);
		const dv = new DataView(arr.buffer);
		return dv.getFloat32(0, true);
	}
};
