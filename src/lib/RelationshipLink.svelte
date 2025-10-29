<script lang="ts">
	function pluralize(relationship: string): string {
		if (relationship.endsWith('y')) {
			return relationship.substr(relationship.length - 1) + 'ies';
		} else {
			return relationship + 's';
		}
	}

	let {
		relationship,
		resourceType,
		resourceId,
		setResource,
		urlBase
	}: {
		relationship: string;
		resourceType: string;
		resourceId: string;
		setResource: (pluralResource: string, resourceId: string) => any;
		urlBase: string;
	} = $props();

	let plural = pluralize(resourceType);
</script>

<p>
	<a
		onclick={(e) => {
			e.preventDefault();
			setResource(plural, resourceId);
		}}
		href="{urlBase}&resource={plural}&resourceId={resourceId}">{`${relationship}: ${resourceId}`}</a
	>
</p>
