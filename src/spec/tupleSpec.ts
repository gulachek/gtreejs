import { expect } from 'chai';
import { Tuple, Unsigned, Utf8, IDecodableTree } from '../index';

describe('Tuple', () =>  {
	const empty = new Tuple([]);

	const tup = new Tuple([
		['n', Unsigned],
		['s', Utf8 ],
	]);

	describe('empty', () => {
		it('encodes as empty', () => {
			const tr = empty.gtreeEncode({});
			expect(tr).to.deep.equal({value:Buffer.from([]), children:[]});
		});

		it('decodes as empty', () => {
			const obj = empty.gtreeDecode({value:[], children:[]});
			expect(obj).to.deep.equal({});
		});
	});

	describe('with_props', () =>  {
		it('encodes properties as children', () => {
			const tr = tup.gtreeEncode({n: 1, s: 'hello'});
			const tr_expect: IDecodableTree = {value: Buffer.from([]), children: [
				Unsigned.gtreeEncode(1),
				Utf8.gtreeEncode('hello')
			]};
			expect(tr).to.deep.equal(tr_expect);
		});

		it('decodes properties', () => {
			const one_hello: IDecodableTree = {value: [], children: [
				Unsigned.gtreeEncode(1),
				Utf8.gtreeEncode('hello')
			]};
			const obj = tup.gtreeDecode(one_hello);
			expect(obj).to.deep.equal({n:1, s:'hello'});
		});

	});
});
