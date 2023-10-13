<script lang="ts" generics="T">
	import type { Map, MapboxGeoJSONFeature } from 'mapbox-gl'
	import type { Subscriber, Unsubscriber, Writable } from 'svelte/store'

	import { Popup } from 'mapbox-gl'
	import { getContext, onMount } from 'svelte'

	export let className = 'max-w-[75%] w-96 rounded-lg overflow-hidden'
	export let closeButton = false
	export let maxWidth = ''

	// eslint-disable-next-line no-undef
	export let store: { subscribe: (run: Subscriber<{ data: T[] }>) => Unsubscriber }
	// eslint-disable-next-line no-undef
	export let itemToID: (item: T) => number | string
	// eslint-disable-next-line no-undef
	export let itemToLngLat: (item: T) => [number, number]

	const map = getContext<Writable<Map>>('mapbox-map')
	const layer = getContext<Writable<string>>('mapbox-layer')

	let clickedItemID: number | string | undefined = undefined
	let popup: Popup | undefined
	let containerRef: HTMLDivElement

	//@ts-expect-error - Hack to fix svelte type narrowing
	// eslint-disable-next-line no-undef
	export let activeItem: T = undefined
	//@ts-expect-error - TODO: Hack to fix svelte type narrowing
	$: activeItem = $store.data.find((item) => itemToID(item) === clickedItemID)
	$: activeItem && popup?.setLngLat(itemToLngLat(activeItem))
	$: !activeItem && popup?.remove()

	onMount(() => {
		function onClose() {
			//@ts-expect-error - TODO: Hack to fix svelte type narrowing
			activeItem = undefined
			clickedItemID = undefined
		}
		function onClick({ features }: { features?: MapboxGeoJSONFeature[] }) {
			clickedItemID = features?.[0].properties?.id as number | string | undefined

			if (!clickedItemID) {
				return
			}

			popup = new Popup({ className, closeButton, maxWidth })
				.setDOMContent(containerRef)
				.addTo($map)
				.once('close', onClose)
		}
		$map.on('click', $layer, onClick)

		return () => {
			$map.off('click', $layer, onClick)
			popup?.off('close', onClose)
			popup?.remove()
		}
	})
</script>

<div class="contents" bind:this={containerRef}>
	{#if activeItem}
		<slot {activeItem} />
	{/if}
</div>
