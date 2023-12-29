<script lang="ts">
	import { PUBLIC_MAPBOX_KEY } from '$env/static/public'

	import { maxBounds } from '$lib/constants'
	import { wsdotAlerts, wsdotBorderCrossings, wsdotCameras } from '$lib/stores/wsdot'
	import { wtaRoutes, wtaVehicles } from '$lib/stores/wta'

	import { onMount } from 'svelte'

	import BusIcon from '$lib/img/BusIcon.svg'
	import CameraIcon from '$lib/img/CameraIcon.svg'
	import GateIcon from '$lib/img/GateIcon.svg'
	import ParatransitBusIcon from '$lib/img/ParatransitBusIcon.svg'
	import SupportVehicleIcon from '$lib/img/SupportVehicleIcon.svg'
	import WarningIcon from '$lib/img/WarningIcon.svg'

	import Mapbox from 'mapbox-gl'

	import { Map, Source, Layer, Image, Control } from 'svelte-mapbox'
	//@ts-expect-error @turf/helpers doesn't roll with types
	import { featureCollection, lineString, point } from '@turf/helpers'

	import AboutControl from '$lib/components/controls/AboutControl.svelte'
	import LayerControl from '$lib/components/controls/LayerControl.svelte'

	import AlertPopup from '$lib/components/popups/AlertPopup.svelte'
	import BorderCrossingPopup from '$lib/components/popups/BorderCrossingPopup.svelte'
	import CameraPopup from '$lib/components/popups/CameraPopup.svelte'
	import VehiclePopup from '$lib/components/popups/VehiclePopup.svelte'

	onMount(() => {
		wtaVehicles.fetch()
		wtaRoutes.fetch()

		wsdotAlerts.fetch()
		wsdotBorderCrossings.fetch()
		wsdotCameras.fetch()

		const intervals = [
			setInterval(() => {
				wtaVehicles.fetch()
			}, 5 * 1000),
			setInterval(
				() => {
					wsdotBorderCrossings.fetch()
				},
				5 * 60 * 1000,
			),
			setInterval(
				() => {
					wsdotAlerts.fetch()
				},
				10 * 60 * 1000,
			),
			setInterval(
				() => {
					wtaRoutes.fetch()
					wsdotCameras.fetch()
				},
				12 * 60 * 60 * 1000,
			),
		]

		return () => {
            intervals.forEach(clearInterval)
		}
	})

	const priorityToColor = {
		Low: '#ffc93c',
		Medium: '#ff9a3c',
		High: '#ff6f3c',
	}
</script>

<svelte:head>
	<title>whatcom.live</title>
	<meta name="description" content="Whatcom County, as it happens" />
</svelte:head>

<Map
	class="min-h-dvh w-full"
	options={{
		accessToken: PUBLIC_MAPBOX_KEY,
		style: 'mapbox://styles/jweilage/clngoh7qn01l401r7gjvmfxa7',
		center: [-122.47, 48.75],
		zoom: 11,
		minZoom: 9,
		maxBounds,
		customAttribution: '<a href="https://weilage.dev">Jack Weilage</a>',
	}}
>
	<Image id="BusIcon" src={BusIcon} options={{ sdf: true }} />
	<Image id="CameraIcon" src={CameraIcon} options={{ sdf: true }} />
	<Image id="GateIcon" src={GateIcon} options={{ sdf: true }} />
	<Image id="ParatransitBusIcon" src={ParatransitBusIcon} options={{ sdf: true }} />
	<Image id="SupportVehicleIcon" src={SupportVehicleIcon} options={{ sdf: true }} />
	<Image id="WarningIcon" src={WarningIcon} options={{ sdf: true }} />

	<Control position="bottom-left" control={new Mapbox.NavigationControl({})} />
	<Control
		position="bottom-left"
		control={new Mapbox.GeolocateControl({
			trackUserLocation: true,
			showUserHeading: true,
			positionOptions: {
				enableHighAccuracy: true,
			},
		})}
	/>
	<Control position="top-left">
		<LayerControl />
	</Control>
	<Control position="top-right">
		<AboutControl />
	</Control>

	{#if $wtaVehicles.visible}
		<Source
			id="wta-vehicles"
			options={{
				type: 'geojson',
				data: featureCollection(
					$wtaVehicles.data.map(({ lng, lat, vehicle: id, routeNumber, vehicleGroup }) =>
						point([lng, lat], {
							id,
							color:
								$wtaRoutes.data.find(({ routeNum }) => +routeNum === routeNumber)?.routeColor ??
								'#000',
							icon:
								vehicleGroup === 'fixedRoute'
									? 'BusIcon'
									: vehicleGroup === 'paratransit'
										? 'ParatransitBusIcon'
										: 'SupportVehicleIcon',
						}),
					),
				),
			}}
		>
			<Layer
				options={{
					id: 'wta-vehicles',
					type: 'symbol',
					layout: {
						'icon-image': ['get', 'icon'],
						'icon-allow-overlap': true,
						'icon-size': 0.75,
					},
					paint: {
						'icon-color': ['get', 'color'],
					},
				}}
			>
				<VehiclePopup />
			</Layer>
		</Source>
	{/if}
	{#if $wtaRoutes.visible}
		<Source
			id="wta-routes"
			options={{
				type: 'geojson',
				data: featureCollection(
					$wtaRoutes.data.flatMap(({ routeNum: id, patterns, routeColor: color }) =>
						patterns.map(({ pt }) =>
							lineString(
								pt.map(({ lon, lat }) => [lon, lat]),
								{ id, color },
							),
						),
					),
				),
			}}
		>
			<Layer
				options={{
					id: 'wta-routes',
					type: 'line',
					paint: {
						'line-color': ['get', 'color'],
						'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 4],
					},
				}}
			>
				<!-- TODO: Implement a route popup (maybe data about the vehicles on the route?) -->
			</Layer>
		</Source>
	{/if}
	{#if $wsdotAlerts.visible}
		<Source
			id="wsdot-alerts"
			options={{
				type: 'geojson',
				data: featureCollection(
					$wsdotAlerts.data.flatMap(
						({ StartRoadwayLocation, EndRoadwayLocation, AlertID, Priority }) => [
							point([StartRoadwayLocation.Longitude, StartRoadwayLocation.Latitude], {
								id: AlertID,
								color: priorityToColor[Priority],
							}),
							point([EndRoadwayLocation.Longitude, EndRoadwayLocation.Latitude], {
								id: AlertID,
								color: priorityToColor[Priority],
							}),
						],
					),
				),
			}}
		>
			<Layer
				options={{
					id: 'wsdot-alerts',
					type: 'symbol',
					layout: {
						'icon-image': 'WarningIcon',
						'icon-size': 1,
					},
					paint: {
						'icon-color': ['get', 'color'],
					},
				}}
			>
				<AlertPopup />
			</Layer>
		</Source>
		<Source
			id="wsdot-alerts-routes"
			options={{
				type: 'geojson',
				data: featureCollection(
					$wsdotAlerts.data
						.filter(({ geometry }) => geometry)
						.map(({ Priority, geometry }) =>
							lineString(geometry?.coordinates, { color: priorityToColor[Priority] }),
						),
				),
			}}
		>
			<Layer
				options={{
					id: 'wsdot-alerts-routes',
					type: 'line',
					paint: {
						'line-color': ['get', 'color'],
						'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 15, 6],
					},
				}}
			></Layer>
		</Source>
	{/if}
	{#if $wsdotBorderCrossings.visible}
		<Source
			id="wsdot-border-crossings"
			options={{
				type: 'geojson',
				data: featureCollection(
					$wsdotBorderCrossings.data.map(({ BorderCrossingLocation, CrossingName }) =>
						point(
							[
								//@ts-expect-error - Always defined, but TS doesn't know
								BorderCrossingLocation.Longitude,
								//@ts-expect-error - Always defined, but TS doesn't know
								BorderCrossingLocation.Latitude,
							],
							{
								id: CrossingName,
								name: BorderCrossingLocation?.Description,
							},
						),
					),
				),
			}}
		>
			<Layer
				options={{
					id: 'wsdot-border-crossings',
					type: 'symbol',
					layout: {
						'icon-image': 'GateIcon',
						'text-field': ['get', 'name'],
						'text-size': 12,
						'text-anchor': 'top',
						'text-offset': [0, 0.8],
					},
				}}
			>
				<BorderCrossingPopup />
			</Layer>
		</Source>
	{/if}
	{#if $wsdotCameras.visible}
		<Source
			id="wsdot-cameras"
			options={{
				type: 'geojson',
				data: featureCollection(
					$wsdotCameras.data.map(({ DisplayLongitude, DisplayLatitude, CameraID }) =>
						point([DisplayLongitude, DisplayLatitude], { id: CameraID }),
					),
				),
			}}
		>
			<Layer
				options={{
					id: 'wsdot-cameras',
					type: 'symbol',
					layout: {
						'icon-image': 'CameraIcon',
						'icon-size': 0.75,
					},
				}}
			>
				<CameraPopup />
			</Layer>
		</Source>
	{/if}
</Map>
