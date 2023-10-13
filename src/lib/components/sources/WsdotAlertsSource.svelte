<script lang="ts">
	import { wsdotAlerts } from '$lib/stores/wsdot'
	import { featureCollection, point } from '@turf/helpers'

	import Layer from '../LayerProvider.svelte'
	import AlertPopup from '../popups/AlertPopup.svelte'
	import Source from './SourceProvider.svelte'
</script>

{#if $wsdotAlerts.visible}
	<Source
		id="source:wsdot-alerts"
		type="geojson"
		data={featureCollection(
			$wsdotAlerts.data.flatMap(
				({ StartRoadwayLocation, EndRoadwayLocation, AlertID, Priority }) => [
					point([StartRoadwayLocation.Longitude, StartRoadwayLocation.Latitude], {
						id: AlertID,
						color: Priority === 'Low' ? '#ffc93c' : Priority === 'Medium' ? '#ff9a3c' : '#ff6f3c',
					}),
					point([EndRoadwayLocation.Longitude, EndRoadwayLocation.Latitude], {
						id: AlertID,
						color: Priority === 'Low' ? '#ffc93c' : Priority === 'Medium' ? '#ff9a3c' : '#ff6f3c',
					}),
				],
			),
		)}
	>
		<Layer
			layer={{
				id: 'layer:wsdot-alerts',
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
{/if}
