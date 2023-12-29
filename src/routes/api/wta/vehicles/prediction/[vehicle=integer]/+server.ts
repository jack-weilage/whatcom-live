import type { Config } from '@sveltejs/adapter-vercel'
import type { RequestEvent } from './$types'

import { client } from '$lib/clients/wta.server'
import { wtaTimestampToDate } from '$lib/utils'
import { json } from '@sveltejs/kit'

export async function GET({ params: { vehicle } }: RequestEvent): Promise<Response> {
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
