<script lang="ts">
	import type { LngLatBoundsLike, LngLatLike, Map } from 'mapbox-gl'

	import { onMount } from 'svelte'

	export let map: Map

	let bounds: LngLatBoundsLike
	let center: LngLatLike

	onMount(() => {
		function onMove() {
			bounds = map.getBounds()
			center = map.getCenter()
		}

		onMove()
		map.on('move', onMove)

		return () => {
			map.off('move', onMove)
		}
	})
</script>

<div class="mapboxgl-ctrl rounded bg-white p-2">
	<p>{bounds}</p>
	<p>{center}</p>
</div>
