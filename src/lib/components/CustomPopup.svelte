<script lang="ts" generics="T">
	import type { MapboxGeoJSONFeature } from 'mapbox-gl'
	import type { Subscriber, Unsubscriber } from 'svelte/store'
	import type { MapContext, LayerContext } from 'svelte-mapbox'

	import { Popup, mapContextKey, layerContextKey } from 'svelte-mapbox'
	import { getContext, onMount, tick } from 'svelte'

	// eslint-disable-next-line no-undef
	export let store: { subscribe: (run: Subscriber<{ data: T[] }>) => Unsubscriber }
	// eslint-disable-next-line no-undef
	export let itemToID: (item: T) => number | string
	// eslint-disable-next-line no-undef
	export let itemToLngLat: (item: T) => [number, number]

	const { mapStore } = getContext<MapContext>(mapContextKey)
	const { layerStore } = getContext<LayerContext>(layerContextKey)

	let activeItemID: number | string | undefined = undefined
	//@ts-expect-error - HACK: to fix svelte type narrowing
	// eslint-disable-next-line no-undef
	export let activeItem: T = undefined
	//@ts-expect-error - HACK: to fix svelte type narrowing
	$: activeItem = $store.data.find((item) => itemToID(item) === activeItemID)

	function onClose() {
		activeItemID = undefined
	}

	onMount(() => {
		async function onClick({ features }: { features?: MapboxGeoJSONFeature[] }) {
			activeItemID = undefined
			// Wait for activeItem to be unset and Popup to be destroyed.
			await tick()
			activeItemID = features?.[0].properties?.id as number | string | undefined
		}

		// eslint-disable-next-line @typescript-eslint/no-misused-promises -- It works...
		$mapStore.on('click', $layerStore.id, onClick)

		return () => {
			// eslint-disable-next-line @typescript-eslint/no-misused-promises -- It works...
			$mapStore.off('click', $layerStore.id, onClick)
		}
	})
</script>

{#if activeItem}
	<Popup
		on:close|once={onClose}
		lngLat={itemToLngLat(activeItem)}
		options={{
			maxWidth: '',
			className: 'max-w-[75%] w-96 rounded-lg overflow-hidden',
			closeButton: false,
		}}
	>
		<slot {activeItem} />
	</Popup>
{/if}

<style>
	/* Hide ugly default styles */
	:global(.mapboxgl-popup-content) {
		display: contents;
	}
	:global(
			:is(
					.mapboxgl-popup-anchor-top-left,
					.mapboxgl-popup-anchor-top,
					.mapboxgl-popup-anchor-top-right
				)
				> .mapboxgl-popup-tip
		) {
		margin-bottom: -1px;
	}
	:global(
			:is(
					.mapboxgl-popup-anchor-bottom-left,
					.mapboxgl-popup-anchor-bottom,
					.mapboxgl-popup-anchor-bottom-right
				)
				> .mapboxgl-popup-tip
		) {
		margin-top: -1px;
	}
	:global(.mapbox-popup-anchor-left > .mapboxgl-popup-tip) {
		margin-right: -1px;
	}
	:global(.mapbox-popup-anchor-right > .mapboxgl-popup-tip) {
		margin-left: -1px;
	}
	:global(.mapboxgl-popup-anchor-top-left > .mapboxgl-popup-content > div > .rounded-xl) {
		border-top-left-radius: 0;
	}
	:global(.mapboxgl-popup-anchor-top-right > .mapboxgl-popup-content > div > .rounded-xl) {
		border-top-right-radius: 0;
	}
	:global(.mapboxgl-popup-anchor-bottom-left > .mapboxgl-popup-content > div > .rounded-xl) {
		border-bottom-left-radius: 0;
	}
	:global(.mapboxgl-popup-anchor-bottom-right > .mapboxgl-popup-content > div > .rounded-xl) {
		border-bottom-right-radius: 0;
	}
	/* Make sure that the tip shows up above the shadow */
	/* :global(.mapboxgl-popup-tip) { */
	/* 	margin-top: -1px; */
	/* } */
</style>
