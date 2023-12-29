<script lang="ts">
	import type { Vehicle } from '$lib/clients/wta.server'

	import { now } from '$lib/stores/misc'
	import { wtaVehicles } from '$lib/stores/wta'
	import { relativeTime } from '$lib/utils'
	import { Chronosis } from 'chronosis'

	import CustomPopup from '../CustomPopup.svelte'

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

	interface ParsedPrediction {
		address: string
		isDelayed: boolean
		time: number
	}
	let predictions: ParsedPrediction[] = []

	let activeItem: Vehicle
	$: if (activeItem?.vehicleGroup === 'fixedRoute') {
		void fetch(`/api/wta/vehicles/prediction/${activeItem.vehicle}`)
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

<CustomPopup
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
		<p class="font-bold">Incoming stops:</p>
		<ul class="flex flex-col gap-2">
			{#each predictions as { address, isDelayed, time }}
				<li class="flex items-center justify-between gap-4">
					<p>{address}</p>
					<p
						class:bg-red-300={isDelayed}
						class="w-24 whitespace-nowrap rounded-lg bg-gray-100 px-4 py-2 text-center"
					>
						{relativeTime($now, time)}
					</p>
				</li>
			{/each}
		</ul>
	{/if}
	<p>
		<b>Last updated:</b>
		{new Chronosis(activeItem.time).format('h:mm:ss a')} ({relativeTime($now, activeItem.time)})
	</p>
</CustomPopup>
