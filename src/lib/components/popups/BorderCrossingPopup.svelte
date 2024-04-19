<script lang="ts">
	import { now } from '$lib/stores/misc'
	import { wsdotBorderCrossings } from '$lib/stores/wsdot'
	import { relativeTime, wsdotTimestampToDate } from '$lib/utils'
	import { Chronosis } from 'chronosis'

	import CustomPopup from '../CustomPopup.svelte'
	import * as Card from '$lib/components/ui/card'
</script>

<CustomPopup
	store={wsdotBorderCrossings}
	itemToID={({ CrossingName }) => CrossingName}
	itemToLngLat={({ BorderCrossingLocation }) => [
		BorderCrossingLocation?.Longitude ?? 0,
		BorderCrossingLocation?.Latitude ?? 0,
	]}
	let:activeItem
>
	{@const lastUpdated = new Chronosis(wsdotTimestampToDate(activeItem.Time))}
	<Card.Root>
		<Card.Header>
			<Card.Title>
				{activeItem.BorderCrossingLocation?.Description ?? 'Unknown Crossing'}
			</Card.Title>
			<!-- TODO: Confirm -->
			<Card.Description>Border Crossing (Updates every 15 minutes)</Card.Description>
		</Card.Header>

		<Card.Content>
			<p>
				<b>Wait time:</b>
				{activeItem.WaitTime} minutes
			</p>
		</Card.Content>

		<Card.Footer>
			<p>
				<b>Last updated:</b>
				{lastUpdated.format('hh:mm a')} ({relativeTime($now, +lastUpdated)})
			</p>
		</Card.Footer>
	</Card.Root>
</CustomPopup>
