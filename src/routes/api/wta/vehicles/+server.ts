import type { Config } from '@sveltejs/adapter-vercel'

import { client } from '$lib/clients/wta.server'
import { json } from '@sveltejs/kit'

export async function GET() {
	const vehicles = await client.getVehicles()
	const now = Date.now()

	return json(
		vehicles.filter(({ time }) => now - time < 60 * 60 * 1000),
		{
			headers: {
				'Cache-Control': `max-age=${5}`,
			},
		},
	)
}

export const config: Config = {
	isr: {
		expiration: 5,
	},
}
