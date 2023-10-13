<script lang="ts">
	import { wtaRoutes } from '$lib/stores/wta'
	import { featureCollection, lineString } from '@turf/helpers'

	import Layer from '../LayerProvider.svelte'
	import Source from './SourceProvider.svelte'
</script>

{#if $wtaRoutes.visible}
	<Source
		id="source:wta-vehicle-routes"
		type="geojson"
		data={featureCollection(
			$wtaRoutes.data.flatMap(({ routeNum: id, patterns, routeColor: color }) =>
				patterns.map(({ pt }) =>
					lineString(
						pt.map(({ lon, lat }) => [lon, lat]),
						{
							id,
							color,
						},
					),
				),
			),
		)}
	>
		<Layer
			layer={{
				id: 'layer:wta-vehicle-routes',
				type: 'line',
				paint: {
					'line-color': ['get', 'color'],
					'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 4],
				},
			}}
		/>
	</Source>
{/if}
