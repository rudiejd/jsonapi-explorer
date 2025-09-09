import { SvelteSet } from 'svelte/reactivity';
import {
	decodeFilterString,
	decodeIncludeString,
	generateFilterString,
	generateIncludeString
} from '../lib/queryParamUtils.svelte.ts';

import { expect, test, describe } from 'vitest';

describe('decodeFilterString', () => {
	test('decodes single filter', () => {
		let filterString = 'filter[foo]=bar';

		expect(decodeFilterString(filterString)).toStrictEqual({ foo: 'bar' });
	});
	test('decodes multiple filters', () => {
		let filterString = 'filter[baz]=bop&filter[john]=cena&filter[hi]=mom';

		expect(decodeFilterString(filterString)).toStrictEqual({ baz: 'bop', john: 'cena', hi: 'mom' });
	});
});

describe('generateFilterString', () => {
	test('generates single filter', () => {
		let filters = { foo: 'bar' };

		expect(generateFilterString(filters)).toBe('filter[foo]=bar');
	});
	test('generates multiple filters', () => {
		let filters = { foo: 'bar', baz: 'bop', bippity: 'boppity' };

		expect(generateFilterString(filters)).toBe(
			'filter[foo]=bar&filter[baz]=bop&filter[bippity]=boppity'
		);
	});
});

describe('decodeIncudeString', () => {
	test('decodes single include', () => {
		let filterString = 'include=strawberries';

		expect(decodeIncludeString(filterString)).toStrictEqual(new SvelteSet(['strawberries']));
	});

	test('decodes multiple includes', () => {
		let filterString = 'include=strawberries,blueberries,grapes';

		expect(decodeIncludeString(filterString)).toStrictEqual(
			new SvelteSet(['strawberries', 'blueberries', 'grapes'])
		);
	});
});

describe('generateIncludeString', () => {
	test('generates single include', () => {
		let includes = new SvelteSet(['foo']);

		expect(generateIncludeString(includes)).toBe('include=foo');
	});
	test('generates multiple includes', () => {
		let includes = new SvelteSet(['foo', 'bar', 'baz']);

		expect(generateIncludeString(includes)).toBe('include=foo,bar,baz');
	});
});
