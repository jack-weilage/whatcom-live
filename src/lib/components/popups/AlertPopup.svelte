<script lang="ts">
	import { now } from '$lib/stores/misc'
	import { wsdotAlerts } from '$lib/stores/wsdot'
	import { relativeTime, wsdotTimestampToDate } from '$lib/utils'
	import { Chronosis } from 'chronosis'

	import CustomPopup from '../CustomPopup.svelte'
	import * as Card from '$lib/components/ui/card'
</script>

<CustomPopup
	store={wsdotAlerts}
	itemToID={({ AlertID }) => AlertID}
	itemToLngLat={({ StartRoadwayLocation, geometry }) => {
		if (!geometry) {
			return [StartRoadwayLocation.Longitude, StartRoadwayLocation.Latitude]
		}

		// If geometry is returned, we should center the popup on the middle of the path
		// HACK: A new array is created to satisfy typescript here.
		// TODO: Use type assertions in Svelte 5
		const [lng, lat] = geometry.coordinates[Math.ceil(geometry.coordinates.length / 2)]
		return [lng, lat]
	}}
	let:activeItem
>
	<Card.Root>
		<Card.Header>
			<Card.Title>
				{activeItem.EventCategory} ({activeItem.Priority} Priority)
			</Card.Title>
			<Card.Description>
				{@html activeItem.HeadlineDescription}
			</Card.Description>
		</Card.Header>
		<Card.Footer class="grid grid-cols-[auto_1fr] gap-x-2">
			{@const startedOnTime = new Chronosis(wsdotTimestampToDate(activeItem.StartTime))}
			{@const lastUpdatedTime = new Chronosis(wsdotTimestampToDate(activeItem.LastUpdatedTime))}

			<b>Started:</b>
			<span>
				{startedOnTime.format('h:mm a, MM/DD/YY')} ({relativeTime($now, +startedOnTime)})
			</span>
			<b>Last updated:</b>
			<span>
				{lastUpdatedTime.format('h:mm a, MM/DD/YY')} ({relativeTime($now, +lastUpdatedTime)})
			</span>
		</Card.Footer>
	</Card.Root>
</CustomPopup>
