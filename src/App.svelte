<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'


  import { onMount } from 'svelte';

  interface RelationshipData {
    id: string;
    type: string;
  }

  interface Relationship {
    data: RelationShipData;
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

  let apiUrl = $state('https://api-v3.mbta.com/routes');
  let data = $derived.by(
    async() => {
      const res = await fetch(apiUrl);
      data = await res.json() as Response;
    });


  onMount(
    async() => {
      const res = await fetch('https://api-v3.mbta.com/routes');
      data = await res.json() as Response;
    }
  )
</script>

<main>
  <h1>JSONAPI Explorer</h1>

  <div>
    <label>API URL</label>
    <input bind:value={apiUrl}> 
  <div>

  <div>
    <p>Filters (make this have n inputs with ability to add input)</p>
  <div>

  <div>
    <p>Sort</p>
  <div>

  <div>
    <p>Include</p>
  </div>

    {#if data.data}
     <table class="japi-data">
       <thead>
       <tr>
        <th>
          ID
        </th>
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
          {#each Object.keys(datum.attributes) as attribute}
           <td>
            {JSON.stringify(datum.attributes[attribute])}
           </td> 
          {/each}
          </tr>
        {/each}
      </tbody>
     </table>
    {/if}

</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #ddd;
  padding: 8px;
}

tr:nth-child(even){background-color: #f2f2f2;}

tr:hover {background-color: #ddd;}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}
</style>
