<script lang="ts">
  import MultiFieldInput from "../lib/MultiFieldInput.svelte";

  import { onMount } from "svelte";

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

  let apiUrl = $state("https://api-v3.mbta.com");
  let resource = $state("vehicles");
  let resourceId: string | undefined = $state(undefined);

  let filters: string | undefined = $state(undefined);

  const setFilters = (value: string) => (filters = value);

  let formApiUrl = $state("https://api-v3.mbta.com");
  let formResource = $state("vehicles");
  let formResourceId: string | undefined = $state(undefined);

  let error: object | undefined = $state(undefined);

  function buildRequestUrl() {
    let url = `${apiUrl}/${resource}`;

    if (resourceId) {
      url += `/${resourceId}`;
    }

    if (filters && filters.length > 0) {
      url += `?${filters}`;
    }

    return url;
  }

  let data = $derived.by(async () => {
    let url = buildRequestUrl();
    const res = await fetch(url);
    if (res.ok) {
      data = (await res.json()) as Response;
    } else {
      error = {
        ...res.json,
        statusCode: res.status,
        statusText: res.statusText,
      };
    }
  });

  onMount(async () => {
    const res = await fetch(`https://api-v3.mbta.com/${resource}`);
    data = (await res.json()) as Response;
  });

  function updateResource(relationship: string, relationshipId: string) {
    if (relationship.endsWith("y")) {
      resource = relationship.substr(relationship.length - 1) + "ies";
    } else {
      resource = relationship + "s";
    }
    if (relationship) {
      resourceId = relationshipId;
    }
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    apiUrl = formApiUrl;
    resource = formResource;
    resourceId = formResourceId;
  }
</script>

<main>
  <h1>JSONAPI Explorer</h1>

  <div>
    <div>
      <div>
        <form onsubmit={handleSubmit}>
          <div>
            <label>API URL</label>
            <input type="text" bind:value={formApiUrl} />
          </div>
          <div>
            <label>Resource</label>
            <input type="text" bind:value={formResource} required />
          </div>
          <div>
            <label>Resource ID</label>
            <input type="text" bind:value={formResourceId} />
          </div>

          <!-- <MultiFieldInput action={"filter"} setText={setFilters} /> -->
          <button type="submit">Explore</button>
        </form>
        <div>
          <div>
            <div>
              <div>
                <div>
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
                              <ul>
                                {#each Object.keys(datum.relationships) as relationship}
                                  {#if datum.relationships[relationship]["data"]}
                                    <p>
                                      <a
                                        onclick={(e) => {
                                          e.preventDefault();
                                          updateResource(
                                            relationship,
                                            datum.relationships[relationship][
                                              "data"
                                            ]["id"],
                                          );
                                        }}
                                        href="{apiUrl}/{relationship}s/{datum
                                          .relationships[relationship]['data'][
                                          'id'
                                        ]}"
                                        >{`${relationship}: ${datum.relationships[relationship]["data"]["id"]}`}</a
                                      >
                                    </p>
                                  {/if}
                                {/each}
                              </ul>
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
                  {:else if typeof data.data == "object"}
                    <ul>
                      <table class="japi-data">
                        <tbody>
                          <tr>
                            <th> Relationships </th>
                            <td>
                              {#if data.data && data.data.relationships}
                                {#each Object.keys(data.data.relationships) as relationship}
                                  {#if data.data.relationships[relationship]["data"]}
                                    <p>
                                      <a
                                        onclick={(e) => {
                                          e.preventDefault();
                                          updateResource(
                                            relationship,
                                            data.data.relationships[
                                              relationship
                                            ]["data"]["id"],
                                          );
                                        }}
                                        href="{apiUrl}/{relationship}s/{data
                                          .data.relationships[relationship][
                                          'data'
                                        ]['id']}"
                                        >{`${relationship}: ${data.data.relationships[relationship]["data"]["id"]}`}</a
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  table {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid #ddd;
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

  input[type="text"],
  select {
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  button {
    background-color: #e7e7e7;
    color: black;
    padding: 10px;
    border-radius: 4px;
    border: none;
  }

  button:hover {
    background-color: #ced6d0;
    color: black;
    padding: 10px;
    border-radius: 4px;
    border: none;
  }
</style>
