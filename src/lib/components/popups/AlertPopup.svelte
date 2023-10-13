<script lang="ts">
	import { now } from '$lib/stores/misc'
	import { wsdotAlerts } from '$lib/stores/wsdot'
	import { relativeTime, wsdotTimestampToDate } from '$lib/utils'
	import { Chronosis } from 'chronosis'

	import Popup from './Popup.svelte'
</script>

<Popup
	store={wsdotAlerts}
	itemToID={({ AlertID }) => AlertID}
	itemToLngLat={({ StartRoadwayLocation }) => [
		StartRoadwayLocation.Longitude,
		StartRoadwayLocation.Latitude,
	]}
	let:activeItem
>
	<h2 class="mb-4 bg-sky-800 p-2 text-lg font-bold text-white">
		Alert: {activeItem.EventCategory} ({activeItem.Priority})
	</h2>
	<p>
		<b>Description:</b>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html activeItem.HeadlineDescription}
	</p>
	{#if activeItem.ExtendedDescription}
		<p>
			<b>Extended description:</b>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html activeItem.ExtendedDescription}
		</p>
	{/if}
	{@const startedOnTime = new Chronosis(wsdotTimestampToDate(activeItem.StartTime))}
	<p>
		<b>Started on:</b>
		{startedOnTime.format('h:mm a, MMMM D, YYYY')} ({relativeTime($now, +startedOnTime)})
	</p>
	{@const lastUpdatedTime = new Chronosis(wsdotTimestampToDate(activeItem.LastUpdatedTime))}
	<p>
		<b>Last updated:</b>
		{lastUpdatedTime.format('h:mm a, MMMM D, YYYY')} ({relativeTime($now, +lastUpdatedTime)})
	</p>
</Popup>
