<script>
	import { wsdotBorderCrossings } from '$lib/stores/wsdot'
	import { featureCollection, point } from '@turf/helpers'

	import Layer from '../LayerProvider.svelte'
	import BorderCrossingPopup from '../popups/BorderCrossingPopup.svelte'
	import Source from './SourceProvider.svelte'
</script>

{#if $wsdotBorderCrossings.visible}
	<Source
		id="source:wsdot-border-crossings"
		type="geojson"
		data={featureCollection(
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
		)}
	>
		<Layer
			layer={{
				id: 'layer:wsdot-border-crossings',
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
