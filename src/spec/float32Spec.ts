import { expect } from 'chai';
import { Float32 } from '../index';

describe('Float32', () => {

	describe('encode', () => {
		it('encodes positive zero', () => {
			const tr = Float32.gtreeEncode(0);
			expect(tr).to.deep.equal({
				value: new Uint8Array([0,0,0,0]),
				children: []
			});
		});

		it('encodes negative zero', () => {
			const tr = Float32.gtreeEncode(-0);
			expect(tr).to.deep.equal({
				value: new Uint8Array([0,0,0,0x80]),
				children: []
			});
		});

		it('encodes positive infinity', () => {
			const tr = Float32.gtreeEncode(Infinity);
			expect(tr).to.deep.equal({
				value: new Uint8Array([0,0,0x80,0x7f]),
				children: []
			});
		});

		it('encodes negative infinity', () => {
			const tr = Float32.gtreeEncode(-Infinity);
			expect(tr).to.deep.equal({
				value: new Uint8Array([0,0,0x80,0xff]),
				children: []
			});
		});

		it('encodes positive normal', () => {
			const tr = Float32.gtreeEncode(0.15625);
			expect(tr).to.deep.equal({
				value: new Uint8Array([0,0,0x20,0x3e]),
				children: []
			});
		});

		it('encodes negative normal', () => {
			const tr = Float32.gtreeEncode(-0.15625);
			expect(tr).to.deep.equal({
				value: new Uint8Array([0,0,0x20,0xbe]),
				children: []
			});
		});

		it('encodes nan', () => {
			const tr = Float32.gtreeEncode(NaN);
			expect(tr).to.deep.equal({
				value: new Uint8Array([0,0,0xc0,0x7f]),
				children: []
			});
		});

		it('encodes negative nan', () => {
			const tr = Float32.gtreeEncode(-NaN);
			expect(tr).to.deep.equal({
				value: new Uint8Array([0,0,0xc0,0xff]),
				children: []
			});
		});

		it('encodes positive subnormal', () => {
			const tr = Float32.gtreeEncode(2.938735877055719e-39);
			expect(tr).to.deep.equal({
				value: new Uint8Array([0, 0, 0x20, 0x00]),
				children: []
			});
		});

		it('encodes negative subnormal', () => {
			const tr = Float32.gtreeEncode(-2.938735877055719e-39);
			expect(tr).to.deep.equal({
				value: new Uint8Array([0, 0, 0x20, 0x80]),
				children: []
			});
		});
	});

	describe('decode', () => {
		it('decodes positive zero', () => {
			const n = Float32.gtreeDecode({value: [0,0,0,0], children: []});

			expect(n).to.equal(0);
			expect(1/n).to.equal(Infinity);
		});

		it('decodes negative zero', () => {
			const n = Float32.gtreeDecode({value: [0,0,0,0x80], children: []});

			expect(n).to.equal(0);
			expect(1/n).to.equal(-Infinity);
		});

		it('decodes positive infinity', () => {
			const n = Float32.gtreeDecode({value: [0,0,0x80,0x7f], children: []});

			expect(n).to.equal(Infinity);
		});

		it('decodes positive infinity', () => {
			const n = Float32.gtreeDecode({value: [0,0,0x80,0xff], children: []});

			expect(n).to.equal(-Infinity);
		});

		it('decodes positive normal', () => {
			const n = Float32.gtreeDecode({value: [0,0,0x20,0x3e], children: []});

			expect(n).to.equal(0.15625);
		});

		it('decodes negative normal', () => {
			const n = Float32.gtreeDecode({value: [0,0,0x20,0xbe], children: []});

			expect(n).to.equal(-0.15625);
		});

		it('decodes nan', () => {
			const n = Float32.gtreeDecode({value: [0x01,0,0x80,0x7f], children: []});

			expect(n).to.be.NaN;
		});

		it('decodes negative nan', () => {
			const n = Float32.gtreeDecode({value: [0x01,0,0x80,0xff], children: []});

			expect(n).to.be.NaN;
		});

		it('decodes positive subnormal', () => {
			const n = Float32.gtreeDecode({value: [0, 0, 0x20, 0x00], children: []});

			expect(n).to.equal(2.938735877055719e-39);
		});

		it('decodes negative subnormal', () => {
			const n = Float32.gtreeDecode({value: [0, 0, 0x20, 0x80], children: []});

			expect(n).to.equal(-2.938735877055719e-39);
		});
	});
});
