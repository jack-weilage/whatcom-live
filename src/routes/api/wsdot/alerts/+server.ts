import type { Config } from '@sveltejs/adapter-vercel'

import { directionsClient } from '$lib/clients/mapbox.server'
import { client } from '$lib/clients/wsdot.server'
import { maxBounds } from '$lib/constants'
import { isInsideBounds } from '$lib/utils'
import { json } from '@sveltejs/kit'

export async function GET() {
	const alerts = await client.getAlerts()

	return json(
		await Promise.all(
			alerts
				.filter(
					({ StartRoadwayLocation }) =>
						StartRoadwayLocation &&
						isInsideBounds(
							[StartRoadwayLocation.Longitude, StartRoadwayLocation.Latitude],
							maxBounds,
						),
				)
				.map(async (alert) => {
					// Sometimes, the API returns zeros for lat/lon
					if (
						!alert.StartRoadwayLocation?.Longitude ||
						!alert.StartRoadwayLocation?.Latitude ||
						!alert.EndRoadwayLocation?.Longitude ||
						!alert.EndRoadwayLocation?.Latitude
					) {
						return alert
					}

					const geometry = await directionsClient
						.getDirections({
							profile: 'driving',
							steps: false,
							alternatives: false,
							geometries: 'geojson',
							overview: 'full',
							waypoints: [
								{
									coordinates: [
										alert.StartRoadwayLocation.Longitude,
										alert.StartRoadwayLocation.Latitude,
									],
								},
								{
									coordinates: [
										alert.EndRoadwayLocation.Longitude,
										alert.EndRoadwayLocation.Latitude,
									],
								},
							],
						})
						.send()
						.then((res) => res.body.routes[0].geometry)

					return {
						...alert,
						geometry,
					}
				}),
		),
		{
			headers: {
				'Cache-Control': `max-age=${10 * 60}`,
			},
		},
	)
}

export const config: Config = {
	isr: {
		expiration: 10 * 60,
	},
}
