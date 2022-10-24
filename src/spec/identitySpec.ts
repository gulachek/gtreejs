import { expect } from 'chai';
import { Identity, IDecodableTree } from '../index';

describe('Identity', () => {

	describe('encode', () => {

		it('encodes to self', () => {
			const does = {not: 'matter'};
			const tr = Identity.gtreeEncode(does as any);
			expect(tr).to.equal(does);
		});

	});

	describe('decode', () => {

		it('decodes to encoded tree', () => {
			const input: IDecodableTree = { value: [1, 2, 3], children: [] };
			const tr = Identity.gtreeDecode(input);
			expect(tr).to.deep.equal({
				value: Uint8Array.from([1, 2, 3]),
				children: []
			});
		});

	});
});
