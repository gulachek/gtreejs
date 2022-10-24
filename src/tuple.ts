import { ITreeable } from './encoding';
import { IEncodedTree, IDecodableTree } from './tree';

type Member<T, TKey extends keyof T> = [TKey, ITreeable<T[TKey]>];

type MembersObj<T> = {
	[Key in keyof T]: Member<T, Key>;
};

type Members<T> = MembersObj<T>[keyof MembersObj<T>];

type ObjBuilder<TObj> = {
	[Property in keyof TObj]+?: TObj[Property];
}

export class Tuple<TObj> implements ITreeable<TObj>
{
	mems: Members<TObj>[] = [];

	constructor(members: Members<TObj>[])
	{
		this.mems = members;
	}

	gtreeEncode(obj: TObj): IEncodedTree
	{
		const out: IEncodedTree = {value:new Uint8Array(), children:[]};
		for (const [name, enc] of this.mems)
			out.children.push(enc.gtreeEncode(obj[name]));

		return out;
	}

	gtreeDecode(tr: IDecodableTree): TObj
	{
		const obj: ObjBuilder<TObj> = {};
		const n = this.mems.length;

		let i = 0;
		for (const child of tr.children)
		{
			const [name, enc] = this.mems[i++];
			obj[name] = enc.gtreeDecode(child);
		}

		if (i !== n)
			throw new Error(`Only ${i} Tuple children found, expected: ${n}`);

		return obj as TObj;
	}
}
