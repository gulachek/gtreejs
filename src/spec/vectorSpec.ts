import { expect } from 'chai';
import { Vector, Unsigned } from '../index';

describe('Vector', () => {

	const enc = new Vector(Unsigned);
	const one = Unsigned.gtreeEncode(1);
	const two = Unsigned.gtreeEncode(2);

	const empty = Uint8Array.from([]);

	describe('gtreeEncode', () =>  {

		it('encodes an empty array as empty tree', () => {
			const tr = enc.gtreeEncode([]);

			expect(tr).to.deep.equal({value: empty, children: []});
		});

		it('encodes a single element', () => {
			const tr = enc.gtreeEncode([1]);

			expect(tr).to.deep.equal({value: empty, children: [one]});
		});

		it('encodes two elements', () => {
			const tr = enc.gtreeEncode([1, 2]);

			expect(tr).to.deep.equal({value: empty,
				children: [one, two]});
		});

	});

	describe('gtreeDecode', () =>  {

		it('decodes an empty tree as empty array', () => {
			const v = enc.gtreeDecode({value: [], children: []});

			expect(v).to.deep.equal([]);
		});

		it('decodes a single element', () => {
			const v = enc.gtreeDecode({value: [], children: [one]});

			expect(v).to.deep.equal([1]);
		});

		it('decodes two elements', () => {
			const v = enc.gtreeDecode({value: [], children: [one, two]});

			expect(v).to.deep.equal([1, 2]);
		});

	});
});
