export type EncodedValue = Uint8Array | Buffer;

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
