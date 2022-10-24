import { expect } from 'chai';
import { Bytes } from '../index';

describe('Bytes', () => {

	describe('encode', () => {

		it('encodes to wrapped value', () => {
			const value = Uint8Array.from([1, 2, 3]);
			const tr = Bytes.gtreeEncode(value);
			expect(tr.value).to.deep.equal(value);
		});

	});

	describe('decode', () => {

		it('decodes to value', () => {
			const value = [1, 2, 3];
			const decoded = Bytes.gtreeDecode({ value, children: [] });
			expect(decoded).to.deep.equal(Uint8Array.from(value));
		});

	});
});
