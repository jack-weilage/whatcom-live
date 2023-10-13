import type { Config } from '@sveltejs/adapter-vercel'

import { client } from '$lib/clients/wta.server'
import { json } from '@sveltejs/kit'

export async function GET() {
	const routes = await client.getRoutes()

	const route_data = await Promise.all(
		routes.map(async (route) => {
			const patterns = await client.getPatternsByRoute(route.routeNum)

			return {
				...route,
				patterns,
			}
		}),
	)

	return json(route_data, {
		headers: {
			'Cache-Control': `max-age=${12 * 60 * 60}`,
		},
	})
}

export const config: Config = {
	isr: {
		expiration: 12 * 60 * 60,
	},
}
