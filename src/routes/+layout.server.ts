import { VERCEL_ANALYTICS_ID } from '$env/static/private'

export function load() {
	return {
		VERCEL_ANALYTICS_ID,
	}
}
