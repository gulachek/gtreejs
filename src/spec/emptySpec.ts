import { expect } from 'chai';
import { Empty } from '../index';

describe('Empty', () => {

	describe('encode', () => {

		it('encodes as empty tree', () => {
			const tr = Empty.gtreeEncode(null);

			expect(tr).to.deep.equal(
				{value: Buffer.from([]), children: []});
		});

	});

	describe('decode', () => {

		it('decodes as null', () => {
			const n = Empty.gtreeDecode(
				{value: [], children: []});

			expect(n).to.be.null;
		});

	});
});
