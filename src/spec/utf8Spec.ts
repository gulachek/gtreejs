import { expect } from 'chai';
import { Utf8 } from '../index';

describe('Utf8', () => {

	describe('gtreeEncode', () => {

		it('encodes empty as an empty tree', () => {
			const tr = Utf8.gtreeEncode(
				'');

			expect(tr).to.deep.equal(
				{value: new Uint8Array([]), children: []});
		});

		it('encodes ascii value', () => {
			const tr = Utf8.gtreeEncode(
				'hello');

			expect(tr).to.deep.equal(
				{value: new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]), children: []});
		});

		it('encodes multibyte value', () => {
			const tr = Utf8.gtreeEncode(
				'💩');

			expect(tr).to.deep.equal(
				{value: new Uint8Array([0xf0, 0x9f, 0x92, 0xa9]), children: []});
		});

	});

	describe('gtreeDecode', () => {

		it('decodes empty as an empty tree', () => {
			const s = Utf8.gtreeDecode(
				{value: new Uint8Array([]), children: []});

			expect(s).to.deep.equal(
				'');
		});

		it('decodes ascii value', () => {
			const s = Utf8.gtreeDecode(
				{value: new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]), children: []});

			expect(s).to.deep.equal(
				'hello');
		});

		it('decodes multibyte value', () => {
			const s = Utf8.gtreeDecode(
				{value: new Uint8Array([0xf0, 0x9f, 0x92, 0xa9]), children: []});

			expect(s).to.deep.equal(
				'💩');
		});

	});
});
