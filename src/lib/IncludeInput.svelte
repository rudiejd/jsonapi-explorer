<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';

	let { setText, initialText } = $props();

	let includes: SvelteSet<string> = decodeIncludeString(initialText);

	function decodeIncludeString(encodedIncludes: string): SvelteSet<string> {
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

	function generateIncludeString(includes: SvelteSet<string>): string {
		let ret = 'include=';
		for (const include of includes) {
			ret += `${include},`;
		}

		return ret;
	}

	let includeToCreate = $state('');
	function addInclude(e: Event) {
		e.preventDefault();
		if (includeToCreate.length > 0) {
			includes.add(includeToCreate);
			includeToCreate = '';

			setText(generateIncludeString(includes));
		}

		return e;
	}

	function removeInclude(includeName: string) {
		includes.delete(includeName);
		setText(generateIncludeString(includes));
	}
</script>

<div>
	<div>
		<input bind:value={includeToCreate} placeholder={`Value to include`} type="text" />
		<button onclick={addInclude}>Add include</button>
	</div>

	{#each includes as include}
		<div>
			<input value={include} readonly type="text" />
			<button onclick={() => removeInclude(include)}>Remove</button>
		</div>
	{/each}
</div>

<style>
	input[type='text'] {
		padding: 12px 20px;
		margin: 8px 0;
		display: inline-block;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}
</style>
