import { expect } from 'chai';
import { KeyValue, Unsigned, Utf8 } from '../index';

describe('KeyValue', () => {

	const enc = new KeyValue({
		s: Utf8,
		n: Unsigned
	});

	const empty = Buffer.from([]);

	const s = {
		value: empty,
		children: [
			Utf8.gtreeEncode('s'),
			Utf8.gtreeEncode('foo')
		]
	};

	const n = {
		value: empty,
		children: [
			Utf8.gtreeEncode('n'),
			Unsigned.gtreeEncode(2)
		]
	};

	describe('gtreeEncode', () => {

		it('encodes an empty object as empty tree', () =>{
			const emptyKv = new KeyValue({});
			const tr = emptyKv.gtreeEncode({});

			expect(tr).to.deep.equal({value: empty, children: []});
		});

		it('encodes an object with a property', () =>{
			const tr = enc.gtreeEncode({s: 'foo', n: 2});

			expect(tr).to.deep.equal({value: empty, children: [ s, n ]});
		});
	});

	describe('gtreeDecode', () => {

		it('decodes an empty tree as empty object', () =>{
			const obj = enc.gtreeDecode({value: [], children: []});

			expect(obj).to.deep.equal({});
		});

		it('decodes a tree with a property', () =>{
			const obj = enc.gtreeDecode({value: [], children: [n,s]});

			expect(obj).to.deep.equal({s:'foo',n:2});
		});

	});
});
