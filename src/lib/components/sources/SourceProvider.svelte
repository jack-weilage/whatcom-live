<script lang="ts">
	import type {
		AnySourceImpl,
		EventData,
		GeoJSONSourceRaw,
		Map,
		MapSourceDataEvent,
	} from 'mapbox-gl'

	import { getContext, onMount, setContext } from 'svelte'
	import { writable, type Writable } from 'svelte/store'

	export let id: string
	export let type: GeoJSONSourceRaw['type']
	export let data: GeoJSONSourceRaw['data']

	const mapStore = getContext<Writable<Map>>('mapbox-map')
	const sourceStore = writable<{ source: AnySourceImpl; id: string }>()
	setContext('mapbox-source', sourceStore)

	$: if ($sourceStore?.source?.type === 'geojson') {
		//@ts-expect-error - The data here technically shouldn't be passed to setData. It works, so whatever
		$sourceStore.source.setData(data)
	}

	onMount(() => {
		if ($mapStore.getSource(id)) {
			$mapStore.removeSource(id)
		}

		$mapStore.addSource(id, { type, data })

		const onSourceData = ({ sourceId }: MapSourceDataEvent & EventData) => {
			if (sourceId !== id) {
				return
			}

			$sourceStore = {
				source: $mapStore.getSource(id),
				id,
			}
			$mapStore.off('sourcedata', onSourceData)
		}
		$mapStore.on('sourcedata', onSourceData)

		return () => {
			// All layers must be removed before unmounting.
			for (const layer of $mapStore.getStyle().layers) {
				//@ts-expect-error - Source does not exist on some layers.
				if (layer.source !== id) {
					return
				}

				$mapStore.removeLayer(layer.id)
			}

			$mapStore.off('sourcedata', onSourceData)
			$mapStore.removeSource(id)
		}
	})
</script>

{#if $sourceStore}
	<slot />
{/if}
