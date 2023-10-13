<script lang="ts">
	import 'mapbox-gl/dist/mapbox-gl.css'

	import { PUBLIC_MAPBOX_KEY } from '$env/static/public'

	import AboutControl from '$lib/components/controls/AboutControl.svelte'
	import ControlProvider from '$lib/components/controls/ControlProvider.svelte'
	import GeolocateControl from '$lib/components/controls/GeolocateControl.svelte'
	import LayerControl from '$lib/components/controls/LayerControl.svelte'
	import NavigationControl from '$lib/components/controls/NavigationControl.svelte'

	import MapProvider from '$lib/components/MapProvider.svelte'

	import { maxBounds } from '$lib/constants'
	import { wsdotAlerts, wsdotBorderCrossings, wsdotCameras } from '$lib/stores/wsdot'
	import { wtaRoutes, wtaVehicles } from '$lib/stores/wta'

	import { onMount } from 'svelte'

	import WsdotAlertsSource from '$lib/components/sources/WsdotAlertsSource.svelte'
	import WsdotBorderCrossingsSource from '$lib/components/sources/WsdotBorderCrossingsSource.svelte'
	import WsdotCamerasSource from '$lib/components/sources/WsdotCamerasSource.svelte'
	import WtaRoutesSource from '$lib/components/sources/WtaRoutesSource.svelte'
	import WtaVehiclesSource from '$lib/components/sources/WtaVehiclesSource.svelte'

	import BusIcon from '$lib/img/BusIcon.svg'
	import CameraIcon from '$lib/img/CameraIcon.svg'
	import GateIcon from '$lib/img/GateIcon.svg'
	import WarningIcon from '$lib/img/WarningIcon.svg'

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
			for (const interval of intervals) {
				clearInterval(interval)
			}
		}
	})
</script>

<svelte:head>
	<title>whatcom.live</title>
	<meta name="description" content="Whatcom County, as it happens" />
</svelte:head>

<MapProvider
	accessToken={PUBLIC_MAPBOX_KEY}
	mapStyle="mapbox://styles/jweilage/clngoh7qn01l401r7gjvmfxa7"
	initialViewState={{ latitude: 48.75, longitude: -122.47, zoom: 11 }}
	{maxBounds}
	minZoom={9}
	icons={[
		{
			name: 'WarningIcon',
			src: WarningIcon,
		},
		{
			name: 'BusIcon',
			src: BusIcon,
		},
		{
			name: 'GateIcon',
			src: GateIcon,
		},
		{
			name: 'CameraIcon',
			src: CameraIcon,
		},
	]}
>
	<NavigationControl />
	<GeolocateControl />
	<ControlProvider component={LayerControl} position="top-left" />
	<ControlProvider component={AboutControl} position="top-right" />

	<WtaRoutesSource />
	<WtaVehiclesSource />

	<WsdotAlertsSource />
	<WsdotBorderCrossingsSource />
	<WsdotCamerasSource />
</MapProvider>
