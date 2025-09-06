<script lang="ts">
	let { setText } = $props();

	let filters: Record<string, string> = $state({});

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
