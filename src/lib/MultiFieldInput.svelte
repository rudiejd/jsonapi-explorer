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
  let valueOfField = $state("");
  function addField(e: Event) {
    e.preventDefault();
    if (fieldToCreate.length > 0) {
      fields = { ...fields, [fieldToCreate]: valueOfField };
      fieldToCreate = "";
      valueOfField = "";

      setText(generateFieldString(fields));
    }

    return e;
  }

  function removeField(fieldName: string) {
    delete fields[fieldName];
    setText(generateFieldString(fields));
  }
</script>

<input
  bind:value={fieldToCreate}
  placeholder={`Field for ${action}`}
  type="text"
/>

<input
  bind:value={valueOfField}
  placeholder={`Value to ${action}`}
  type="text"
/>
<button onclick={addField}>Add {action}</button>

{#each Object.keys(fields) as field}
  <div>
    <input placeholder="field" value={field} readonly type="text" />
    <input
      placeholder="field"
      bind:value={
        () => fields[field],
        (v) => {
          fields[field] = v;
          setText(fields);
        }
      }
      type="text"
    />
    <button onclick={() => removeField(field)}>Remove</button>
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
