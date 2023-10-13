import type { Config } from '@sveltejs/adapter-vercel'

import { client } from '$lib/clients/wsdot.server'
import { maxBounds } from '$lib/constants'
import { isInsideBounds } from '$lib/utils'
import { json } from '@sveltejs/kit'

export async function GET() {
	const crossings = await client.getBorderCrossings()

	return json(
		crossings.filter(
			({ BorderCrossingLocation }) =>
				BorderCrossingLocation &&
				isInsideBounds(
					[BorderCrossingLocation.Longitude, BorderCrossingLocation.Latitude],
					maxBounds,
				),
		),
		{
			headers: {
				'Cache-Control': `max-age=${5 * 60}`,
			},
		},
	)
}

export const config: Config = {
	isr: {
		expiration: 5 * 60,
	},
}
