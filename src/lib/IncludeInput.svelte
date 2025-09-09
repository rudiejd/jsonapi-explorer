<script lang="ts">
	import { decodeIncludeString, generateIncludeString } from './queryParamUtils.svelte.ts';

	import { SvelteSet } from 'svelte/reactivity';

	let { setText, initialText } = $props();

	let includes: SvelteSet<string> = decodeIncludeString(initialText);

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
