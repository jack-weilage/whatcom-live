<script lang="ts">
	import { wtaRoutes, wtaVehicles } from '$lib/stores/wta'
	import { featureCollection, point } from '@turf/helpers'

	import Layer from '../LayerProvider.svelte'
	import VehiclePopup from '../popups/VehiclePopup.svelte'
	import Source from './SourceProvider.svelte'
</script>

{#if $wtaVehicles.visible}
	<Source
		id="source:wta-vehicle-realtime"
		type="geojson"
		data={featureCollection(
			$wtaVehicles.data.map(({ routeNumber, lng, lat, vehicle: id }) =>
				point([lng, lat], {
					id,
					color:
						$wtaRoutes.data.find(({ routeNum }) => +routeNum === routeNumber)?.routeColor ?? '#000',
				}),
			),
		)}
	>
		<Layer
			layer={{
				id: 'layer:wta-vehicle-realtime',
				type: 'symbol',
				layout: {
					'icon-image': 'BusIcon',
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
