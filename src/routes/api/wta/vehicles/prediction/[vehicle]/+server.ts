import type { Config } from '@sveltejs/adapter-vercel'

import { client } from '$lib/clients/wta.server'
import { error, json } from '@sveltejs/kit'

export async function GET({ params: { vehicle } }) {
	if (!vehicle) {
		throw error(403)
	}

	const predictions = await client.getPredictionsByVehicle(vehicle)

	return json(predictions.slice(0, 5), {
		headers: {
			'Cache-Control': `max-age=${5}`,
		},
	})
}

export const config: Config = {
	isr: {
		expiration: 5,
	},
}
