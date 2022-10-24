import { IEncodedTree, IDecodableTree } from './tree';

export interface ITreeEncodable<TVal>
{
	gtreeEncode(value: TVal): IEncodedTree;
}

export interface ITreeDecodable<TVal>
{
	gtreeDecode(tr: IDecodableTree): TVal;
}

export interface ITreeable<TVal>
	extends ITreeEncodable<TVal>, ITreeDecodable<TVal>
{
}
