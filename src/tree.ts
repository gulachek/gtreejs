export type EncodedValue = Uint8Array;

export interface IDecodableTree
{
	value: Iterable<number>,
	children: Iterable<IDecodableTree>
};

export interface IEncodedTree
{
	value: EncodedValue,
	children: IEncodedTree[]
};
