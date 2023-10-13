import type { Config } from '@sveltejs/adapter-vercel'

import { client } from '$lib/clients/wsdot.server'
import { maxBounds } from '$lib/constants'
import { isInsideBounds } from '$lib/utils'
import { json } from '@sveltejs/kit'

export async function GET() {
	const crossings = await client.getCameras()

	return json(
		crossings.filter(
			({ IsActive, DisplayLongitude, DisplayLatitude }) =>
				IsActive && isInsideBounds([DisplayLongitude, DisplayLatitude], maxBounds),
		),
		{
			headers: {
				'Cache-Control': `max-age=${12 * 60 * 60}`,
			},
		},
	)
}

export const config: Config = {
	isr: {
		expiration: 12 * 60 * 60,
	},
}
