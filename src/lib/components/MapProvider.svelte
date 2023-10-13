<script lang="ts">
	import type { LngLatBoundsLike } from 'mapbox-gl'
	import type { Writable } from 'svelte/store'

	import { Map } from 'mapbox-gl'
	import { onMount, setContext } from 'svelte'
	import { writable } from 'svelte/store'

	export let accessToken: string
	export let mapStyle: string
	export let initialViewState: {
		longitude: number
		latitude: number
		zoom: number
	}
	export let maxZoom: number | undefined = undefined
	export let minZoom: number | undefined = undefined
	export let maxBounds: LngLatBoundsLike | undefined = undefined
	export let icons: {
		name: string
		src: string
	}[] = []

	let container: HTMLDivElement
	let isMapLoaded = false

	const mapStore = writable<Map>()
	setContext<Writable<Map>>('mapbox-map', mapStore)

	onMount(() => {
		$mapStore = new Map({
			container,
			style: mapStyle,
			accessToken,
			center: {
				lat: initialViewState.latitude,
				lng: initialViewState.longitude,
			},
			zoom: initialViewState.zoom,
			maxZoom,
			minZoom,
			maxBounds,
		})

		const onLoad = async () => {
			for (const { name, src } of icons) {
				if ($mapStore.hasImage(name)) {
					$mapStore.removeImage(name)
				}

				$mapStore.addImage(
					name,
					await new Promise<HTMLImageElement>((res) => {
						const img = new Image()
						img.src = src

						img.addEventListener('load', () => {
							res(img)
						})
					}),
					{ sdf: true },
				)
			}

			isMapLoaded = true
		}

		$mapStore.on('load', onLoad)

		return () => {
			isMapLoaded = false
			$mapStore.off('load', onLoad)
		}
	})
</script>

<div bind:this={container} class="min-h-screen w-full">
	{#if isMapLoaded}
		<slot />
	{/if}
</div>
