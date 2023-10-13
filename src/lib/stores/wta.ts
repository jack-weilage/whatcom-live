import type { Pattern, Route, Vehicle } from '$lib/clients/wta.server'

import { createLayerStore } from './misc'

export interface RouteData extends Route {
	patterns: Pattern[]
}

export const wtaVehicles = createLayerStore<Vehicle[]>([], true, '/api/wta/vehicles')
export const wtaRoutes = createLayerStore<RouteData[]>([], true, '/api/wta/routes')
