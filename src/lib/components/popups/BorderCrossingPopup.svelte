<script lang="ts">
	import { now } from '$lib/stores/misc'
	import { wsdotBorderCrossings } from '$lib/stores/wsdot'
	import { relativeTime, wsdotTimestampToDate } from '$lib/utils'
	import { Chronosis } from 'chronosis'

	import Popup from './Popup.svelte'
</script>

<Popup
	store={wsdotBorderCrossings}
	itemToID={({ CrossingName }) => CrossingName}
	itemToLngLat={({ BorderCrossingLocation }) => [
		//@ts-expect-error - TODO: Svelte type narrowing
		BorderCrossingLocation.Longitude,
		//@ts-expect-error - TODO: Svelte type narrowing
		BorderCrossingLocation.Latitude,
	]}
	let:activeItem
>
	{@const lastUpdated = new Chronosis(wsdotTimestampToDate(activeItem.Time))}
	<h2 class="mb-4 bg-sky-800 p-2 text-lg font-bold text-white">
		<!-- TODO: Svelte type narrowing -->
		Crossing: {activeItem.BorderCrossingLocation?.Description}
	</h2>
	<p>
		<b>Wait time:</b>
		{activeItem.WaitTime} minutes
	</p>
	<p>
		<b>Last updated:</b>
		{lastUpdated.format('hh:mm a')} ({relativeTime($now, +lastUpdated)})
	</p>
</Popup>
