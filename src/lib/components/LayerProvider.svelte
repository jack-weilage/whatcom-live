<script lang="ts">
	import type { AnyLayer, Map, Source } from 'mapbox-gl'
	import type { Writable } from 'svelte/store'

	import { getContext, onMount, setContext } from 'svelte'
	import { writable } from 'svelte/store'

	export let layer: AnyLayer

	const mapStore = getContext<Writable<Map>>('mapbox-map')
	const sourceStore = getContext<Writable<{ source: Source; id: string }>>('mapbox-source')
	const layerStore = writable<string>(layer.id)
	setContext('mapbox-layer', layerStore)

	onMount(() => {
		if ($mapStore.getLayer(layer.id)) {
			$mapStore.removeLayer(layer.id)
		}

		$mapStore.addLayer({
			//@ts-expect-error - Source does not exist on some layers.
			source: $sourceStore.id,
			...layer,
		})

		return () => {
			$mapStore.removeLayer(layer.id)
		}
	})
</script>

<slot />
