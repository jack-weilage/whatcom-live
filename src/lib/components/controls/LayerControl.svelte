<script lang="ts">
	import { wsdotAlerts, wsdotBorderCrossings, wsdotCameras } from '$lib/stores/wsdot'
	import { wtaRoutes, wtaVehicles } from '$lib/stores/wta'

	import BusIcon from '$lib/img/BusIcon.svg'
	import CameraIcon from '$lib/img/CameraIcon.svg'
	import GateIcon from '$lib/img/GateIcon.svg'
	import PathIcon from '$lib/img/PathIcon.svg'
	import WarningIcon from '$lib/img/WarningIcon.svg'

	$: layers = [
		{
			name: 'WTA Vehicles',
			src: BusIcon,
			visible: $wtaVehicles.visible,
			store: wtaVehicles,
		},
		{
			name: 'WTA Routes',
			src: PathIcon,
			visible: $wtaRoutes.visible,
			store: wtaRoutes,
		},
		{
			name: 'WSDOT Border Crossings',
			src: GateIcon,
			visible: $wsdotBorderCrossings.visible,
			store: wsdotBorderCrossings,
		},
		{
			name: 'WSDOT Alerts',
			src: WarningIcon,
			visible: $wsdotAlerts.visible,
			store: wsdotAlerts,
		},
		{
			name: 'WSDOT Cameras',
			src: CameraIcon,
			visible: $wsdotCameras.visible,
			store: wsdotCameras,
		},
	]
</script>

<div class="mapboxgl-ctrl flex flex-wrap gap-2 pr-10">
	{#each layers as { name, visible, store, src } (name)}
		<label
			class:bg-gray-100={!visible}
			class:text-gray-400={!visible}
			class="flex cursor-pointer items-center rounded-full bg-white px-2 py-1.5"
		>
			<input
				type="checkbox"
				checked={visible}
				class="hidden cursor-pointer"
				on:change={({ currentTarget }) => {
					currentTarget.checked ? store.show() : store.hide()
				}}
			/>
			<img {src} alt="" class="mr-2 aspect-square w-5" />
			{name}
		</label>
	{/each}
</div>
