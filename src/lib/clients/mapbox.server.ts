import { PUBLIC_MAPBOX_KEY } from '$env/static/public'

import mapboxDirectionsClient from '@mapbox/mapbox-sdk/services/directions'
import mapboxMapMatchingClient from '@mapbox/mapbox-sdk/services/map-matching'

const baseClient = { accessToken: PUBLIC_MAPBOX_KEY }

export const mapMatchingClient = mapboxMapMatchingClient(baseClient)
export const directionsClient = mapboxDirectionsClient(baseClient)
