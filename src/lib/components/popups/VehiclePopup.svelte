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

	function updatePredictions(vehicle: Vehicle | undefined) {
		if (!vehicle || (vehicle.vehicleGroup === 'fixedRoute' && !vehicle.routeNumber)) {
			predictions = []
			return
		}

		switch (vehicle.vehicleGroup) {
			case 'fixedRoute':
				void fetch(`/api/wta/vehicles/prediction/${vehicle.vehicle}`)
					.then((res) => res.json() as Promise<ParsedPrediction[]>)
					.then((preds) => {
						predictions = preds
					})
				break
			case 'paratransit': {
				const midnight = new Chronosis().startOf('day')
				predictions = []

				for (let i = 1; i <= 3; i++) {
					predictions.push({
						address: vehicle[`pt${i as 1 | 2 | 3}Address`] ?? '--',
						isDelayed: false,
						time: +midnight.add(vehicle[`pt${i as 1 | 2 | 3}estTime`] ?? 0),
					})
				}
				break
			}
		}
	}

	$: updatePredictions(activeItem)

	import { Badge } from '$lib/components/ui/badge'
	import { Button } from '$lib/components/ui/button'
	import * as Card from '$lib/components/ui/card'
	import * as Collapsible from '$lib/components/ui/collapsible'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import * as Tooltip from '$lib/components/ui/tooltip'

	import { CaretSort } from 'radix-icons-svelte'

	const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000
</script>

<CustomPopup
	store={wtaVehicles}
	itemToID={({ vehicle }) => vehicle}
	itemToLngLat={({ lng, lat }) => [lng, lat]}
	bind:activeItem
>
	<Card.Root>
		<Card.Header>
			<Card.Title>
				{#if activeItem.routeNumber && activeItem.directionName}
					{activeItem.routeNumber}
					{activeItem.directionName}
				{:else}
					Out Of Service
				{/if}
			</Card.Title>
			<Card.Description>
				{groupToGroupName(activeItem.vehicleGroup)} Vehicle (Updates every 15 seconds)
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if activeItem.routeNumber && activeItem.routeName}
				<p>
					<b>Route:</b>
					{activeItem.routeNumber}
					{activeItem.routeName}
				</p>
			{/if}

			{#if (activeItem.vehicleGroup === 'fixedRoute' && activeItem.routeNumber) || activeItem.vehicleGroup === 'paratransit'}
				<p class="font-bold">Incoming stops:</p>
				<ul class="flex flex-col gap-2">
					{#each predictions as { address, isDelayed, time }}
						<li class="flex items-center justify-between gap-4">
							<p class="text-sm">{address}</p>
							<Tooltip.Root>
								<Tooltip.Trigger>
									<Badge variant={isDelayed ? 'destructive' : 'default'} class="whitespace-nowrap">
										{relativeTime($now, time + timezoneOffset)}
									</Badge>
								</Tooltip.Trigger>
								<Tooltip.Content>
									{new Chronosis(time).format('hh:mm a')}
								</Tooltip.Content>
							</Tooltip.Root>
						</li>
					{:else}
						{#each { length: activeItem.vehicleGroup === 'fixedRoute' ? 5 : 3 } as _}
							<li class="flex items-center justify-between gap-4">
								<Skeleton class="h-6 w-40" />
								<Skeleton class="h-6 w-12" />
							</li>
						{/each}
					{/each}
				</ul>
			{/if}
		</Card.Content>
		<Card.Footer class="flex-col items-start">
			<Collapsible.Root class="mt-4 w-full">
				<Collapsible.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" class="flex w-full justify-between">
						Advanced <CaretSort />
					</Button>
				</Collapsible.Trigger>
				<Collapsible.Content class="mt-2">
					<p>
						<b>Vehicle ID:</b>
						{activeItem.vehicle}
					</p>
					<p>
						<b>Last updated:</b>
						{new Chronosis(activeItem.time).format('h:mm:ss a')} ({relativeTime(
							$now,
							activeItem.time,
						)})
					</p>
					{#if activeItem.heading !== undefined}
						<p>
							<b>Heading:</b>
							{headingToDirection(activeItem.heading)} ({activeItem.heading % 360}&deg;)
						</p>
					{/if}
					<p>
						<b>Speed:</b>
						{activeItem.speed ?? 'Unknown'} MPH
					</p>
					<p>
						<b>Satelites:</b>
						{activeItem.satellites ?? 'Unknown'}
					</p>
					<p>
						<b>Last EProbe:</b>
						{activeItem.lastEProbe
							? new Chronosis(activeItem.lastEProbe).format('h:mm:ss a')
							: 'Unknown'}
					</p>
					<p>
						<b>Last OOSProbe:</b>
						{activeItem.lastOOSProbe
							? new Chronosis(activeItem.lastOOSProbe).format('h:mm:ss a')
							: 'Unknown'}
					</p>
				</Collapsible.Content>
			</Collapsible.Root>
		</Card.Footer>
	</Card.Root>
</CustomPopup>
