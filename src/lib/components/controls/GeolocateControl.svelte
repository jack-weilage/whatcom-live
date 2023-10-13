<script lang="ts">
	import type { Writable } from 'svelte/store'

	import { GeolocateControl, Map } from 'mapbox-gl'
	import { getContext, onMount } from 'svelte'

	export let position: Parameters<Map['addControl']>[1] = 'bottom-left'

	const mapStore = getContext<Writable<Map>>('mapbox-map')

	onMount(() => {
		const control = new GeolocateControl({
			trackUserLocation: true,
			showUserHeading: true,
			positionOptions: {
				enableHighAccuracy: true,
			},
		})

		$mapStore.addControl(control, position)

		return () => {
			$mapStore.removeControl(control)
		}
	})
</script>
