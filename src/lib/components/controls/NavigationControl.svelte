<script lang="ts">
	import type { Writable } from 'svelte/store'

	import { Map, NavigationControl } from 'mapbox-gl'
	import { getContext, onMount } from 'svelte'

	export let position: Parameters<Map['addControl']>[1] = 'bottom-left'

	const mapStore = getContext<Writable<Map>>('mapbox-map')

	onMount(() => {
		const control = new NavigationControl()

		$mapStore.addControl(control, position)

		return () => {
			$mapStore.removeControl(control)
		}
	})
</script>
