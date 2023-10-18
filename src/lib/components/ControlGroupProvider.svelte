<script lang="ts">
	import type { Map } from 'mapbox-gl'

	import { setContext } from 'svelte'

	export let position: Parameters<Map['addControl']>[1]

	setContext('mapbox-control-position', position)
</script>

<slot />
