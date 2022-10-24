import { expect } from 'chai';
import { Variant, Utf8, Unsigned } from '../index';

interface IMyTypes
{
	num: number,
	str: string
}

describe('Variant', () => {

	const one = Unsigned.gtreeEncode(1);

	const enc = new Variant<IMyTypes>([
		['num', Unsigned],
		['str', Utf8]
	]);

	describe('gtreeEncode', () => {
		it('encodes an alt', () => {
			const tr = enc.gtreeEncode(
				{type:'num', value:1});

			expect(tr).to.deep.equal(
				{value:Buffer.from([]), children:[one]});
		});

		it('encodes another alt', () => {
			const tr = enc.gtreeEncode(
				{type: 'str', value:'hello'});

			expect(tr).to.deep.equal(
				{value:Buffer.from([1]), children:[Utf8.gtreeEncode('hello')]});
		});
	});

	describe('gtreeDecode', () => {
		it('decodes an alt', () => {
			const obj = enc.gtreeDecode(
				{value:[0], children:[one]});

			expect(obj).to.deep.equal(
				{type: 'num', value:1});
		});

		it('decodes another alt', () => {
			let obj = enc.gtreeDecode(
				{value:[1], children:[Utf8.gtreeEncode('yo')]});

			expect(obj).to.deep.equal(
				{type: 'str', value:'yo'});
		});
	});
});
