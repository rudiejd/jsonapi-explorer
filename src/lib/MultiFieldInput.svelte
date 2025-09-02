<script lang="ts">
  let { action, setText } = $props();

  let fields: Record<string, string> = $state({});

  function generateFieldString(fields: Record<string, string>): string {
    let ret = "";
    for (const [field, fieldValue] of Object.entries(fields)) {
      if (ret.length > 0) {
        ret += "&";
      }
      ret += `${action}[${field}]=${fieldValue}`;
    }

    return ret;
  }

  let fieldToCreate = $state("");
  function handleSubmit(e: Event) {
    e.preventDefault();
    fields = { ...fields, [fieldToCreate]: "" };
    fieldToCreate = "";

    setText(generateFieldString(fields));

    return e;
  }
</script>

<form onsubmit={handleSubmit}>
  <input
    bind:value={fieldToCreate}
    placeholder={`Field for ${action}`}
    type="text"
    required
  />
  <button type="submit">Add {action}</button>
</form>

{#each Object.keys(fields) as field}
  <div>
    <input placeholder="field" value={field} readonly type="text" />
    <input placeholder="field" bind:value={fields[field]} type="text" />
  </div>
{/each}

<style>
  input[type="text"],
  select {
    width: 30%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
</style>
