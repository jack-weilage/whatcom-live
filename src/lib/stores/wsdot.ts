import type { Alert, BorderCrossing, Camera } from '$lib/clients/wsdot.server'

import { createLayerStore } from './misc'

//TODO: https://www.wsdot.wa.gov/ferries/api/schedule/documentation/rest.html
//TODO: https://www.wsdot.wa.gov/traffic/api/
// wsdot wsf vessels
//TODO: https://dot.alaska.gov/amhs/map.shtml
//TODO: https://dot.alaska.gov/amhs/xml/Fleet.xml
// amhs ferry vessels

export const wsdotBorderCrossings = createLayerStore<BorderCrossing[]>(
	[],
	true,
	'/api/wsdot/border-crossings',
)
export const wsdotAlerts = createLayerStore<Alert[]>([], true, '/api/wsdot/alerts')
export const wsdotCameras = createLayerStore<Camera[]>([], false, '/api/wsdot/cameras')
