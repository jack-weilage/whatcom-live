<script lang="ts">
	import { wsdotCameras } from '$lib/stores/wsdot'
	import { featureCollection, point } from '@turf/helpers'

	import Layer from '../LayerProvider.svelte'
	import CameraPopup from '../popups/CameraPopup.svelte'
	import Source from './SourceProvider.svelte'
</script>

{#if $wsdotCameras.visible}
	<Source
		id="source:wsdot-cameras"
		type="geojson"
		data={featureCollection(
			$wsdotCameras.data.map(({ DisplayLongitude, DisplayLatitude, CameraID }) =>
				point([DisplayLongitude, DisplayLatitude], { id: CameraID }),
			),
		)}
	>
		<Layer
			layer={{
				id: 'layer:wsdot-cameras',
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
