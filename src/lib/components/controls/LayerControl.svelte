<script lang="ts">
	import { wsdotAlerts, wsdotBorderCrossings, wsdotCameras } from '$lib/stores/wsdot'
	import {
		wtaFixedRouteVehicles,
		wtaParatransitVehicles,
		wtaRoutes,
		wtaSupportVehicles,
	} from '$lib/stores/wta'

	import BusIcon from '$lib/img/BusIcon.svg'
	import ParatransitVehicleIcon from '$lib/img/ParatransitBusIcon.svg'
	import SupportVehicleIcon from '$lib/img/SupportVehicleIcon.svg'

	import CameraIcon from '$lib/img/CameraIcon.svg'
	import GateIcon from '$lib/img/GateIcon.svg'
	import PathIcon from '$lib/img/PathIcon.svg'
	import WarningIcon from '$lib/img/WarningIcon.svg'

	interface Service {
		type: 'service'
		name: string
		icon: string
		visible: boolean
		store: {
			hide(): void
			show(): void
		}
	}
	interface ServiceGroup {
		type: 'service-group'
		name: string
		services: Service[]
	}
	interface Organization {
		type: 'organization'
		name: string
		services: (Service | ServiceGroup)[]
	}
	$: organizations = [
		{
			type: 'organization',
			name: 'WTA',
			services: [
				{
					type: 'service-group',
					name: 'Vehicles',
					services: [
						{
							type: 'service',
							name: 'Fixed Route',
							icon: BusIcon,
							visible: $wtaFixedRouteVehicles.visible,
							store: wtaFixedRouteVehicles,
						},
						{
							type: 'service',
							name: 'Paratransit',
							icon: ParatransitVehicleIcon,
							visible: $wtaParatransitVehicles.visible,
							store: wtaParatransitVehicles,
						},
						{
							type: 'service',
							name: 'Support',
							icon: SupportVehicleIcon,
							visible: $wtaSupportVehicles.visible,
							store: wtaSupportVehicles,
						},
					],
				},
				{
					type: 'service',
					name: 'Bus Routes',
					icon: PathIcon,
					visible: $wtaRoutes.visible,
					store: wtaRoutes,
				},
			],
		},
		{
			type: 'organization',
			name: 'WSDOT',
			services: [
				{
					type: 'service',
					name: 'Border Crossings',
					icon: GateIcon,
					visible: $wsdotBorderCrossings.visible,
					store: wsdotBorderCrossings,
				},
				{
					type: 'service',
					name: 'Alerts',
					icon: WarningIcon,
					visible: $wsdotAlerts.visible,
					store: wsdotAlerts,
				},
				{
					type: 'service',
					name: 'Street Cameras',
					icon: CameraIcon,
					visible: $wsdotCameras.visible,
					store: wsdotCameras,
				},
			],
		},
	] as Organization[]

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { HamburgerMenu } from 'radix-icons-svelte'
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<button use:builder.action {...builder}>
			<HamburgerMenu class="mapboxgl-ctrl-icon stroke-2 p-1.5" />
		</button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		{#each organizations as { name, services }, i}
			<DropdownMenu.Label>{name}</DropdownMenu.Label>
			{#each services as service}
				{#if service.type === 'service'}
					<DropdownMenu.CheckboxItem
						class="flex gap-x-2"
						checked={service.visible}
						on:change={(ev) => {
							//@ts-expect-error: Bad type coercion, `service` will always be of type `Service`
							ev.detail ? service.store.show() : service.store.hide()
						}}
					>
						<img src={service.icon} alt="" class="w-4" />
						{service.name}
					</DropdownMenu.CheckboxItem>
				{:else if service.type === 'service-group'}
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>{service.name}</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent>
							{#each service.services as { visible, store, name, icon }}
								<!-- TODO: This wraps weird. -->
								<DropdownMenu.CheckboxItem
									class="flex gap-x-2 whitespace-nowrap text-nowrap pr-8"
									checked={visible}
									on:change={(ev) => {
										ev.detail ? store.show() : store.hide()
									}}
								>
									<img src={icon} alt="" class="size-4" />
									{name}
								</DropdownMenu.CheckboxItem>
							{/each}
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
				{/if}
			{/each}
			{#if i < organizations.length - 1}
				<DropdownMenu.Separator />
			{/if}
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
