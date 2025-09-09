import { expect, test, describe } from 'vitest';

import { objectsToCsvString } from '../lib/csvUtils.svelte.ts';

describe('objectsToCsvString', () => {
	test('serializes to csv', () => {
		const objs = [
			{ foo: 'bar', baz: 'bop' },
			{ foo: '1', baz: { a: 'b', c: 'd' } }
		];

		expect(objectsToCsvString(objs)).toBe('foo,baz\n"bar","bop"\n"1",{"a":"b";"c":"d"}');
	});
});
