<script lang="ts">
	import type { Vehicle } from '$lib/clients/wta.server'

	import { now } from '$lib/stores/misc'
	import { wtaVehicles } from '$lib/stores/wta'
	import { relativeTime } from '$lib/utils'
	import { Chronosis } from 'chronosis'

	import Popup from './Popup.svelte'

	function groupToGroupName(group: Vehicle['vehicleGroup']) {
		switch (group) {
			case 'support':
				return 'Support'
			case 'paratransit':
				return 'Paratransit'
			case 'fixedRoute':
				return 'Fixed Route'
			default:
				return 'Unknown'
		}
	}
	function headingToDirection(heading: number) {
		const directions = [
			'N',
			'NNE',
			'NE',
			'ENE',
			'E',
			'ESE',
			'SE',
			'SSE',
			'S',
			'SSW',
			'SW',
			'WSW',
			'W',
			'WNW',
			'NW',
			'NNW',
		]
		const i =
			Math.round(((heading %= 360) < 0 ? heading + 360 : heading) / (360 / directions.length)) %
			directions.length

		return directions[i]
	}
	let activeItem: Vehicle
	interface ParsedPrediction {
		address: string
		isDelayed: boolean
		time: number
	}
	let predictions: ParsedPrediction[] = []

	$: if (activeItem?.vehicleGroup === 'fixedRoute') {
		fetch(`/api/wta/vehicles/prediction/${activeItem.vehicle}`)
			.then((res) => res.json() as Promise<ParsedPrediction[]>)
			.then((preds) => {
				predictions = preds
			})
	} else if (activeItem?.vehicleGroup === 'paratransit') {
		const midnight = new Chronosis().startOf('day')
		predictions = []

		const handlePoint = (address?: string, estimate?: number) => {
			if (!address || !estimate) {
				return
			}

			predictions.push({
				address,
				isDelayed: false,
				time: +midnight.add(estimate * 1000),
			})
		}

		handlePoint(activeItem.pt1Address, activeItem.pt1estTime)
		handlePoint(activeItem.pt2Address, activeItem.pt2estTime)
		handlePoint(activeItem.pt3Address, activeItem.pt3estTime)
	} else if (!activeItem) {
		// If nothing is selected, prediction array should be emptied.
		predictions = Array(5)
			.fill(0)
			.map((_, i) => ({
				address: `Loading stop ${i + 1}...`,
				time: -1,
				isDelayed: false,
			}))
	}
</script>

<Popup
	store={wtaVehicles}
	itemToID={({ vehicle }) => vehicle}
	itemToLngLat={({ lng, lat }) => [lng, lat]}
	bind:activeItem
>
	<h2 class="mb-4 bg-sky-800 p-2 text-lg font-bold text-white">
		Vehicle: {activeItem.vehicle}
	</h2>
	<p>
		<b>Vehicle type:</b>
		{groupToGroupName(activeItem.vehicleGroup)}
	</p>
	{#if activeItem.routeNumber && activeItem.routeName}
		<p>
			<b>Route:</b>
			{activeItem.routeNumber}
			{activeItem.routeName}
		</p>
	{/if}
	{#if activeItem.directionName}
		<p>
			<b>Direction:</b>
			{activeItem.directionName}
		</p>
	{/if}
	<p>
		<b>Speed:</b>
		{activeItem.speed} MPH
	</p>
	{#if activeItem.heading !== undefined}
		<p>
			<b>Heading:</b>
			{activeItem.heading}&deg; {headingToDirection(activeItem.heading)}
		</p>
	{/if}
	{#if activeItem.vehicleGroup === 'fixedRoute' || activeItem.vehicleGroup === 'paratransit'}
		<p><b>Incoming stops:</b></p>
		{#each predictions as { address, isDelayed, time }, i (address)}
			<li class="flex justify-between gap-8">
				<span>
					<b>{i + 1}.</b>
					{address}
				</span>
				<span class:text-red-700={isDelayed}>
					{relativeTime($now, time)}
				</span>
			</li>
		{/each}
	{/if}
	<p>
		<b>Last updated:</b>
		{new Chronosis(activeItem.time).format('h:mm:ss a')} ({relativeTime($now, activeItem.time)})
	</p>
</Popup>
