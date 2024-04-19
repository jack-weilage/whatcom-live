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

	import * as Card from '$lib/components/ui/card'
</script>

<CustomPopup
	store={wsdotCameras}
	itemToID={({ CameraID }) => CameraID}
	itemToLngLat={({ DisplayLongitude, DisplayLatitude }) => [DisplayLongitude, DisplayLatitude]}
	let:activeItem
>
	<Card.Root>
		<Card.Header>
			<Card.Title>
				{activeItem.Title}
			</Card.Title>
			<Card.Description>Street Camera (Updates every minute)</Card.Description>
		</Card.Header>
		<Card.Content>
			<img
				src="{activeItem.ImageURL}?cache={cacheBreak}"
				alt=""
				width={activeItem.ImageWidth}
				height={activeItem.ImageHeight}
				class="w-full"
			/>
		</Card.Content>
		{#if activeItem.CameraOwner}
			<Card.Footer>
				{#if activeItem.CameraOwner}
					<p>
						<b>Owned by:</b>
						<a href={activeItem.OwnerURL}>{activeItem.CameraOwner}</a>
					</p>
				{/if}
			</Card.Footer>
		{/if}
	</Card.Root>
</CustomPopup>
