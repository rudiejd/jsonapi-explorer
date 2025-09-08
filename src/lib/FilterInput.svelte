<script lang="ts">
	let { setText, initialText } = $props();

	let initialFilters = {};
	if (initialText && initialText.length > 0) {
		initialFilters = decodeFilterString(initialText);
	}

	let filters: Record<string, string> = $state(initialFilters);

	function decodeFilterString(encodedFilters: string) {
		let decodedFilters = {};
		// do I have to worry about forcing this regexp to only compile once? although since it's decoding URL query params, it should only run on mount anyway
		const re = /filter\[(.+?)\]=([^&]+)&?/;
		const matches = [...encodedFilters.matchAll(re)];

		for (let i = 0; i < matches.length; i++) {
			const [_, field, value] = matches[i];
			decodedFilters[field] = value;
		}

		return decodedFilters;
	}

	function generateFilterString(filters: Record<string, string>): string {
		let ret = '';
		for (const [filter, filterValue] of Object.entries(filters)) {
			if (ret.length > 0) {
				ret += '&';
			}
			ret += `filter[${filter}]=${filterValue}`;
		}

		return ret;
	}

	let filterToCreate = $state('');
	let valueOfFilter = $state('');
	function addFilter(e: Event) {
		e.preventDefault();
		if (filterToCreate.length > 0) {
			filters = { ...filters, [filterToCreate]: valueOfFilter };
			filterToCreate = '';
			valueOfFilter = '';

			setText(generateFilterString(filters));
		}

		return e;
	}

	function removeFilter(filterName: string) {
		delete filters[filterName];
		setText(generateFilterString(filters));
	}
</script>

<div>
	<div>
		<input
			bind:value={filterToCreate}
			placeholder={`Field for filter`}
			type="text"
			class="form-text-input"
		/>
		<input
			bind:value={valueOfFilter}
			placeholder={`Value to filter`}
			type="text"
			class="form-text-input"
		/>

		<button onclick={addFilter}>Add filter</button>
	</div>

	{#each Object.keys(filters) as filter}
		<div>
			<input placeholder="filter" value={filter} readonly type="text" />
			<input
				placeholder="filter"
				bind:value={
					() => filters[filter],
					(v) => {
						filters[filter] = v;
						setText(filters);
					}
				}
				type="text"
			/>
			<button onclick={() => removeFilter(filter)}>Remove</button>
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
