import type { WSDOTTimestamp } from './clients/wsdot.server'

export function wtaTimestampToDate(timestamp: string) {
	const res = /(\d{4})(\d{2})(\d{2}) (\d{2}):(\d{2})/.exec(timestamp)!

	return new Date(+res[1], +res[2] - 1, +res[3], +res[4], +res[5])
}
export function relativeTime(now: number, then: number) {
	const delta = Math.abs(now - then)

	function evaluateUnit(unit: string, unitDuration: number, maxUnitCount: number) {
		const unitDelta = Math.trunc(delta / unitDuration)

		if (maxUnitCount < unitDelta) {
			return false
		}

		if (now < then) {
			return `in ${unitDelta} ${unit}${unitDelta === 1 ? '' : 's'}`
		} else if (then < now) {
			return `${unitDelta} ${unit}${unitDelta === 1 ? '' : 's'} ago`
		}

		return 'now'
	}

	return (
		// checkUnit('millisecond', 1, 1000) ||
		evaluateUnit('second', 1000, 60) ||
		evaluateUnit('minute', 60 * 1000, 60) ||
		evaluateUnit('hour', 60 * 60 * 1000, 24) ||
		evaluateUnit('day', 24 * 60 * 60 * 1000, 31) ||
		evaluateUnit('month', 31 * 24 * 60 * 60 * 1000, 12) ||
		evaluateUnit('year', 12 * 31 * 24 * 60 * 60 * 1000, Infinity)
	)
}
export const wsdotTimestampToDate = (timestamp: WSDOTTimestamp) =>
	new Date(Number(/Date\((\d+)-\d{4}\)/.exec(timestamp)![1]))

export const isInsideBounds = (
	[lng, lat]: [number, number],
	[[minLng, minLat], [maxLng, maxLat]]: [[number, number], [number, number]],
) => lng > minLng && lng < maxLng && lat > minLat && lat < maxLat
