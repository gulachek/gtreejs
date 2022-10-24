import { ITreeable } from './encoding';
import { IEncodedTree, IDecodableTree } from './tree';
import { Unsigned } from './unsigned';

type Alt<T, TKey extends keyof T> = [TKey, ITreeable<T[TKey]>];

type AltsObj<T> = {
	[Key in keyof T]: Alt<T, Key>;
};

type Alts<T> = AltsObj<T>[keyof T];

type Var<T, TKey extends keyof T> = {
	type: TKey;
	value: T[TKey];
}

type VarsObj<T> = {
	[Key in keyof T]: Var<T, Key>;
}

/*
type PartialVarsObj<T> = {
	[Key in keyof T]-?: Partial<Var<T, Key>>;
}
*/

type Vars<T> = VarsObj<T>[keyof VarsObj<T>];
//type PartialVars<T> = PartialVarsObj<T>[keyof PartialVarsObj<T>];

export class Variant<TAlts> implements ITreeable<Vars<TAlts>>
{
	#alts: Alts<TAlts>[];

	constructor(alts: Alts<TAlts>[])
	{
		this.#alts = alts;
	}

	gtreeEncode(obj: Vars<TAlts>): IEncodedTree
	{
		for (let i = 0; i < this.#alts.length; ++i)
		{
			const [type, enc] = this.#alts[i];
			if (type !== obj.type) { continue; }
			const tr = Unsigned.gtreeEncode(i);
			tr.children = [enc.gtreeEncode(obj.value)];
			return tr;
		}

		throw new Error(`Invalid variant type`);
	}

	gtreeDecode(tr: IDecodableTree): Vars<TAlts>
	{
		const index = Unsigned.gtreeDecode(tr);

		if (index > this.#alts.length)
			throw new Error(`Invalid variant index: ${index}`);

		const [type, enc] = this.#alts[index];
		const childArray = [...tr.children];
		return { type, value: enc.gtreeDecode(childArray[0]) };
	}
}

module.exports = { Variant };
