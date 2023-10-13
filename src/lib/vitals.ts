import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals'

export function reportVitals(dsn: string, href: string, route: string) {
	if (!dsn) {
		console.log('[vitals] Development mode enabled, skipping vitals test')
		return
	}

	//@ts-expect-error - Connection doesn't exist on navigator yet
	const speed = navigator.connection?.effectiveType ?? ''

	for (const onMetric of [onCLS, onFCP, onFID, onINP, onLCP, onTTFB]) {
		onMetric(({ name, id, value }) => {
			const body = {
				dsn,
				event_name: name,
				href,
				id,
				page: route,
				speed,
				value: value.toString(),
			}

			navigator.sendBeacon(
				'https://vitals.vercel-analytics.com/v1/vitals',
				new URLSearchParams(body),
			)
		})
	}
}
