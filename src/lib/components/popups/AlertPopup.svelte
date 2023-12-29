<script lang="ts">
	import { now } from '$lib/stores/misc'
	import { wsdotAlerts } from '$lib/stores/wsdot'
	import { relativeTime, wsdotTimestampToDate } from '$lib/utils'
	import { Chronosis } from 'chronosis'

	import CustomPopup from '../CustomPopup.svelte'
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
	<h2 class="mb-4 bg-sky-800 p-2 text-lg font-bold text-white">
		Alert: {activeItem.EventCategory} ({activeItem.Priority} Priority)
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
		<b>Started:</b>
		{relativeTime($now, +startedOnTime)} ({startedOnTime.format('h:mm a, MM/DD/YY')})
	</p>
	{@const lastUpdatedTime = new Chronosis(wsdotTimestampToDate(activeItem.LastUpdatedTime))}
	<p>
		<b>Last updated:</b>
		{relativeTime($now, +lastUpdatedTime)} ({lastUpdatedTime.format('h:mm a, MM/DD/YY')})
	</p>
</CustomPopup>
