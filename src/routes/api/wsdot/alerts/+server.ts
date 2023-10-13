import type { Config } from '@sveltejs/adapter-vercel'

import { client } from '$lib/clients/wsdot.server'
import { maxBounds } from '$lib/constants'
import { isInsideBounds } from '$lib/utils'
import { json } from '@sveltejs/kit'

export async function GET() {
	const alerts = await client.getAlerts()

	return json(
		alerts.filter(
			({ StartRoadwayLocation }) =>
				StartRoadwayLocation &&
				isInsideBounds([StartRoadwayLocation.Longitude, StartRoadwayLocation.Latitude], maxBounds),
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
