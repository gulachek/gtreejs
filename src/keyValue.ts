import { ITreeable } from './encoding';
import { IEncodedTree, IDecodableTree } from './tree';
import { Tuple } from './tuple';
import { Utf8 } from './utf8';
import { Identity } from './identity';

type KeyValEncoding<TKeyVal> = {
	[Key in keyof TKeyVal]-?: ITreeable<TKeyVal[Key]>;
}

type KeyValPair<TKeyVal, TKey extends keyof TKeyVal> = {
	key: TKey,
	val: TKeyVal[TKey]
}

type KeyValPairsObj<TKeyVal> = {
	[Key in keyof TKeyVal]-?: KeyValPair<TKeyVal, Key>;
}

type KeyValPairs<TKeyVal> = KeyValPairsObj<TKeyVal>[keyof KeyValPairsObj<TKeyVal>];

export class KeyValue<TKeyVal> implements ITreeable<TKeyVal>
{
	#enc: KeyValEncoding<TKeyVal>;
	#key: ITreeable<keyof TKeyVal>;

	constructor(enc: KeyValEncoding<TKeyVal>)
	{
		this.#enc = enc;
		this.#key = Utf8 as ITreeable<keyof TKeyVal>;
	}

	gtreeEncode(obj: TKeyVal): IEncodedTree
	{
		const children: IEncodedTree[] = [];

		for (const k in obj)
		{
			const tup = new Tuple<{ key: keyof TKeyVal, val: TKeyVal[keyof TKeyVal]}>([
				['key', this.#key],
				['val', this.#enc[k]]
			]);

			children.push(tup.gtreeEncode({key: k, val: obj[k]}));
		}

		return {value: new Uint8Array(), children: children};
	}

	gtreeDecode(tr: IDecodableTree): TKeyVal
	{
		const obj: Partial<TKeyVal> = {};

		for (const kvp of tr.children)
		{
			const tup = new Tuple<{ key: keyof TKeyVal, val: IEncodedTree }>([
				['key', this.#key],
				['val', Identity]
			]);

			const pair = tup.gtreeDecode(kvp);
			obj[pair.key] = this.#enc[pair.key].gtreeDecode(pair.val);
		}

		return obj as TKeyVal;
	}
}
