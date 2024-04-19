import type { Pattern, Route, Vehicle } from '$lib/clients/wta.server'

import { createDerivedLayerStore, createLayerStore } from './misc'

export interface RouteData extends Route {
	patterns: Pattern[]
}

export const wtaVehicles = createLayerStore<Vehicle[]>([], true, '/api/wta/vehicles')

export const wtaParatransitVehicles = createDerivedLayerStore(
	wtaVehicles.data_store,
	(vehicles) => vehicles.filter(({ vehicleGroup }) => vehicleGroup === 'paratransit'),
	false,
)
export const wtaSupportVehicles = createDerivedLayerStore(
	wtaVehicles.data_store,
	(vehicles) => vehicles.filter(({ vehicleGroup }) => vehicleGroup === 'support'),
	false,
)
export const wtaFixedRouteVehicles = createDerivedLayerStore(
	wtaVehicles.data_store,
	(vehicles) => vehicles.filter(({ vehicleGroup }) => vehicleGroup === 'fixedRoute'),
	true,
)

export const wtaRoutes = createLayerStore<RouteData[]>([], true, '/api/wta/routes')
