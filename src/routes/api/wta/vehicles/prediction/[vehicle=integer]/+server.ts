import type { Config } from '@sveltejs/adapter-vercel'

import { client } from '$lib/clients/wta.server'
import { wtaTimestampToDate } from '$lib/utils'
import { error, json } from '@sveltejs/kit'

export async function GET({ params: { vehicle } }) {
	if (!vehicle) {
		throw error(403)
	}

	const predictions = await client.getPredictionsByVehicle(vehicle)

	return json(
		predictions.slice(0, 5).map(({ stpnm, dly, prdtm }) => ({
			address: stpnm,
			isDelayed: dly,
			time: +wtaTimestampToDate(prdtm),
		})),
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
