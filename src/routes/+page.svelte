<script lang="ts">
	import IncludeInput from '../lib/IncludeInput.svelte';
	import FilterInput from '../lib/FilterInput.svelte';
	import { base } from '$app/paths';

	import { onMount } from 'svelte';

	interface RelationshipData {
		id: string;
		type: string;
	}

	interface Relationship {
		data: RelationshipData;
	}

	interface Data {
		id: string;
		relationships: Record<string, Relationship>;
		attributes: Record<string, any>;
		type: string;
	}

	interface Response {
		data: [Data];
	}

	let requestUrl = $state(undefined);

	const params = new URLSearchParams(document.location.search);

	let filters: string | undefined = $state(params.get('filters'));
	let includes: string | undefined = $state(params.get('includes'));
	let apiUrl = $state(params.get('apiUrl'));
	let resource = $state(params.get('resource'));
	let resourceId: string | undefined = $state(params.get('resourceId'));

	const setFilters = (value: string) => (filters = value);
	const setIncludes = (value: string) => (includes = value);

	let error: object | undefined = $state(undefined);

	function buildRequestUrl(
		apiUrl: string,
		resource: string,
		resourceId: string,
		filters: string,
		includes: string
	) {
		let url = `${apiUrl}/${resource}`;

		if (resourceId) {
			url += `/${resourceId}`;
		}

		if (filters && filters.length > 0) {
			url += `?${filters}`;
		}

		if (includes && includes.length > 0) {
			if (url.includes('?')) {
				url += `&${includes}`;
			} else {
				url += `?${includes}`;
			}
		}

		return url;
	}

	function buildQueryParams() {
		let queryParams = new URLSearchParams(document.location.search);

		queryParams.set('apiUrl', apiUrl);
		queryParams.set('resource', resource);

		if (resourceId && resourceId.length > 0) {
			queryParams.set('resourceId', resourceId);
		}

		if (filters && filters.length > 0) {
			queryParams.set('filters', filters);
		}

		if (includes && includes.length > 0) {
			queryParams.set('includes', includes);
		}

		return queryParams.toString();
	}

	let data = $derived.by(async () => {
		let res = await fetch(requestUrl);
		if (res.ok) {
			let json = res.json();

			history.pushState(JSON.stringify(json), '', `${base}?${buildQueryParams()}`);
			return json;
		} else {
			let json = await res.json();
			error = {
				...json,
				statusCode: res.status,
				statusText: res.statusText
			};

			return Promise.reject();
		}
	});

	function applyRequestParams() {
		if (!apiUrl || !resource) {
			apiUrl = 'https://api-v3.mbta.com';
			resource = 'vehicles';
		}

		requestUrl = buildRequestUrl(apiUrl, resource, resourceId, filters, includes);
	}

	window.addEventListener('popstate', (e) => {
		applyRequestParams();
	});

	onMount(async () => {
		applyRequestParams();
	});

	function updateResource(relationship: string, relationshipId: string) {
		if (relationship.endsWith('y')) {
			resource = relationship.substr(relationship.length - 1) + 'ies';
		} else {
			resource = relationship + 's';
		}
		if (relationship) {
			resourceId = relationshipId;
		}

		requestUrl = buildRequestUrl(apiUrl, resource, resourceId, filters, includes);
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		requestUrl = buildRequestUrl(apiUrl, resource, resourceId, filters, includes);
	}
</script>

<header>
	<div class="container">
		<h1>JSONAPI Explorer</h1>
		<h2>
			Explore the content of APIs that follow the <a href="https://jsonapi.org/"
				>JSON:API standard</a
			>
		</h2>

		<h3>Current URL: {requestUrl}</h3>
	</div>
</header>

<main>
	<div class="container" style="padding: 8px;">
		<form onsubmit={handleSubmit}>
			<fieldset
				style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 5px; width: 90%"
			>
				<div style="display: flex; flex-direction: column;">
					<label>API URL</label>
					<input type="text" bind:value={apiUrl} />
				</div>

				<div style="display: flex; flex-direction: column;">
					<label>Resource</label>
					<input type="text" bind:value={resource} required />
				</div>

				<div style="display: flex; flex-direction: column;">
					<label>Resource ID</label>
					<input type="text" bind:value={resourceId} />
				</div>
			</fieldset>
			<fieldset style="display: flex">
				<legend>Filters</legend>
				<FilterInput setText={setFilters} initialText={$state.snapshot(filters)} />
			</fieldset>
			<fieldset>
				<legend>Includes</legend>
				<IncludeInput setText={setIncludes} initialText={$state.snapshot(includes)} />
			</fieldset>

			<div>
				<button type="submit">Explore</button>
			</div>
		</form>
	</div>
	<div class="table-container container">
		{#await data}
			<p>Loading...</p>
		{:then data}
			{#if Array.isArray(data.data)}
				<table class="japi-data">
					<thead>
						<tr>
							<th> ID </th>
							<th>Relationships</th>
							{#each Object.keys(data.data[0].attributes) as attribute}
								<th>
									{attribute}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each data.data as datum}
							<tr>
								<td>
									{datum.id}
								</td>
								<td>
									{#if datum.relationships}
										<ul>
											{#each Object.keys(datum.relationships) as relationship}
												{#if datum.relationships[relationship]['data']}
													<p>
														<a
															onclick={(e) => {
																e.preventDefault();
																updateResource(
																	relationship,
																	datum.relationships[relationship]['data']['id']
																);
															}}
															href="{apiUrl}/{relationship}s/{datum.relationships[relationship][
																'data'
															]['id']}"
															>{`${relationship}: ${datum.relationships[relationship]['data']['id']}`}</a
														>
													</p>
												{/if}
											{/each}
										</ul>
									{/if}
								</td>
								{#each Object.keys(datum.attributes) as attribute}
									<td>
										{JSON.stringify(datum.attributes[attribute])}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			{:else if typeof data.data == 'object'}
				<ul>
					<table class="japi-data">
						<tbody>
							<tr>
								<th> Relationships </th>
								<td>
									{#if data.data && data.data.relationships}
										{#each Object.keys(data.data.relationships) as relationship}
											{#if data.data.relationships[relationship]['data']}
												<p>
													<a
														onclick={(e) => {
															e.preventDefault();
															updateResource(
																relationship,
																data.data.relationships[relationship]['data']['id']
															);
														}}
														href="{apiUrl}/{relationship}s/{data.data.relationships[relationship][
															'data'
														]['id']}"
														>{`${relationship}: ${data.data.relationships[relationship]['data']['id']}`}</a
													>
												</p>
											{/if}
										{/each}
									{/if}
								</td>
							</tr>
							{#each Object.keys(data.data.attributes) as attribute}
								<tr>
									<th>
										{attribute}
									</th>
									<td>
										{data.data.attributes[attribute]}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</ul>
			{:else}
				<p style="color: red;">Could not handle API response:</p>
				<pre>
                          {JSON.stringify(error, null, 2)}
                        </pre>
			{/if}
		{:catch}
			<p style="color: red">Encountered error from API:</p>
			<pre>{JSON.stringify(error, null, 2)}</pre>
		{/await}
	</div>
</main>

<style>
	table {
		border-collapse: collapse;
		border: 10px;
		white-space: normal;
		width: 100%;
	}

	td,
	th {
		border: 0.5px solid #ddd;
		padding: 8px;
	}

	tr:nth-child(even) {
		background-color: #f2f2f2;
	}

	tr:hover {
		background-color: #ddd;
	}

	th {
		padding-top: 6px;
		padding-bottom: 6px;
		text-align: left;
		background-color: #04aa6d;
		color: white;
	}

	input[type='text'],
	select {
		padding: 12px 20px;
		margin: 5px 0;
		display: inline-block;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.container {
		width: 95%;
		margin: 0 auto;
	}

	main {
		font-size: 16px;
		width: 100%;
	}

	fieldset {
		border: none;
	}

	h2,
	h3 {
		color: #5a5a5a;
	}

	.table-container {
		overflow: scroll;
		max-height: 500px;
	}
</style>
