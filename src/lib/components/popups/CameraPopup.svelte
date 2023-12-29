<script lang="ts">
	import { wsdotCameras } from '$lib/stores/wsdot'
	import { onMount } from 'svelte'

	import CustomPopup from '../CustomPopup.svelte'

	let cacheBreak = 0
	onMount(() => {
		const interval = setInterval(
			() => {
				cacheBreak = Date.now()
			},
			1 * 60 * 1000,
		)

		return () => {
			clearInterval(interval)
		}
	})
</script>

<CustomPopup
	store={wsdotCameras}
	itemToID={({ CameraID }) => CameraID}
	itemToLngLat={({ DisplayLongitude, DisplayLatitude }) => [DisplayLongitude, DisplayLatitude]}
	let:activeItem
>
	<h2 class="mb-4 bg-sky-800 p-2 text-lg font-bold text-white">
		Camera: {activeItem.Title}
	</h2>

	<img
		src="{activeItem.ImageURL}?cache={cacheBreak}"
		alt=""
		width={activeItem.ImageWidth}
		height={activeItem.ImageHeight}
		class="w-full"
	/>
</CustomPopup>
