import { SvelteSet } from 'svelte/reactivity';

export function decodeFilterString(encodedFilters: string) {
	if (!encodedFilters || encodedFilters.length == 0) {
		return {};
	}
	let decodedFilters = {};
	// do I have to worry about forcing this regexp to only compile once? although since it's decoding URL query params, it should only run on mount anyway
	const re = /filter\[(.+?)\]=([^&]+)&?/g;
	const matches = [...encodedFilters.matchAll(re)];

	for (let i = 0; i < matches.length; i++) {
		const [_, field, value] = matches[i];
		decodedFilters[field] = value;
	}

	return decodedFilters;
}

export function generateFilterString(filters: Record<string, string>): string {
	let ret = '';
	for (const [filter, filterValue] of Object.entries(filters)) {
		if (ret.length > 0) {
			ret += '&';
		}
		ret += `filter[${filter}]=${filterValue}`;
	}

	return ret;
}

export function decodeIncludeString(encodedIncludes: string): SvelteSet<string> {
	let decodedIncludes = new SvelteSet<string>();
	if (!encodedIncludes || encodedIncludes.length == 0) {
		return decodedIncludes;
	}

	const re = /include=(.+)/g;
	const matches = [...encodedIncludes.matchAll(re)];

	if (matches.length != 1 || matches[0].length != 2) {
		throw `Invalid include string in query params: ${encodedIncludes}`;
	}

	const [_, includesCsv] = matches[0];

	const includes = includesCsv.split(',');
	for (const include of includes) {
		if (include.trim().length > 0) {
			decodedIncludes.add(include);
		}
	}

	return decodedIncludes;
}

export function generateIncludeString(includes: SvelteSet<string>): string {
	let ret = 'include=';

	const items = includes.values();

	let include = items.next();
	while (include.value) {
		ret += include.value;

		include = items.next();
		if (include.value) {
			ret += ',';
		}
	}

	return ret;
}
