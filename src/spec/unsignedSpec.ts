import { expect } from 'chai';
import { Unsigned } from '../index';

describe('Unsigned', () => {

	describe('gtreeEncode', () => {

		it('encodes zero as an empty tree', () => {
			const tr = Unsigned.gtreeEncode(0);
			expect(tr).to.deep.equal({value: Buffer.from([]), children: []});
		});

		it('encodes single byte value', () => {
			const tr = Unsigned.gtreeEncode(25);
			expect(tr).to.deep.equal({value: Buffer.from([25]), children: []});
		});

		it('encodes double byte value', () => {
			const tr = Unsigned.gtreeEncode(0xaabb);
			const val = Buffer.from([0xbb, 0xaa]);
			expect(tr).to.deep.equal({value: val, children: []});
		});

		it('encodes triple byte value', () => {
			const tr = Unsigned.gtreeEncode(0xaabbcc);
			const val = Buffer.from([0xcc, 0xbb, 0xaa]);
			expect(tr).to.deep.equal({value: val, children: []});
		});

	});

	describe('gtreeDecode', () => {

		it('decodes empty tree as zero', () => {
			const n = Unsigned.gtreeDecode({value: [], children: []});

			expect(n).to.equal(0);
		});

		it('decodes single byte value', () => {
			const n = Unsigned.gtreeDecode({value: [25], children: []});

			expect(n).to.equal(25);
		});

		it('decodes double byte value', () => {
			const val = [0xbb, 0xaa];
			const n = Unsigned.gtreeDecode({value: val, children: []});

			expect(n).to.equal(0xaabb);
		});

		it('decodes triple byte value', () => {
			const val = [0xcc, 0xbb, 0xaa];
			const n = Unsigned.gtreeDecode({value: val, children: []});

			expect(n).to.equal(0xaabbcc);
		});

	});
});
