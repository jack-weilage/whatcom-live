import { BaseClient } from './base.server'

interface Detour {
	id: string
	state: 'active' /* | 'inactive' */
	description: string
	routedirection: {
		rt: string
		dir: string
	}[]
	startdate: string
	enddate: string
}
export interface Route {
	routeNum: string
	routeName: string
	routeColor: string
}
interface Bulletin {
	/** name */
	nm: string
	/** subject */
	sbj: string
	/** detailed description */
	dtl: string
	/** brief description */
	brf: string
	/** priority */
	prty: 'Low' | 'Medium' | 'High'
	/** cause */
	cse: 'Construction'
	/** effect */
	efct: 'Detour'
	/** service disruptions */
	srvc: {
		/** route id */
		rt: string
		/** route direction */
		rtdir: string
		/** stop id */
		stpid: string
		/** stop name */
		stpnm: string
	}[]
	/** modified timestamp */
	mod: string
	/** url (always bustracker) */
	url: 'bustracker.ridewta.com'
}
interface Direction {
	id: string
	name: string
}
export interface Pattern {
	/** pattern id */
	pid: number
	/** pattern length (in feet) */
	ln: number
	/** pattern direction */
	rtdir: string
	pt: (PatternWaypoint | PatternStop)[]
}

export enum PatternPointType {
	Waypoint = 'W',
	Stop = 'S',
}
interface PatternPoint {
	/** index in sequence */
	seq: number
	lat: number
	lon: number
	/** type */
	typ: PatternPointType
}
interface PatternWaypoint extends PatternPoint {
	typ: PatternPointType.Waypoint
}
interface PatternStop extends PatternPoint {
	typ: PatternPointType.Stop
	/** stop id */
	stpid: string
	/** stop name */
	stpnm: string
	/** distance (in feet) from last stop */
	pdist: number
}

type StringBoolean = 'Yes' | 'No'
export interface Stop {
	id: number
	name: string
	stopNum: number
	locality: string
	street: string
	nearestCrossStreet: string
	sidewalk: StringBoolean
	lighting: StringBoolean
	shelter: StringBoolean
	bench: StringBoolean
	trashcan: StringBoolean
	// lol WTA misspelled latitude
	latitutde: number
	longitude: number
}

enum PredictionType {
	Arrival = 'A',
	Departure = 'D',
}
enum DynamicActionType {
	None,
	Canceled,
	Reassigned,
	Shifted,
	Expressed,
	StopsAffected,
	NewTrip,
	PartialTrip,
	PartialTripNew,
	DelayedCancel,
	AddedStop,
	UnknownDelay,
	UnknownDelayNew,
	InvalidatedTrip,
	InvalidatedTripNew,
	CanceledTripNew,
	StopsAffectedNew,
}
enum FlagStopType {
	Undefined = -1,
	Normal,
	PickupAndDischarge,
	OnlyDischarge,
}
export interface Prediction {
	/** timestamp */
	tmstmp: string
	/** type */
	typ: PredictionType
	/** stop name */
	stpnm: string
	/** stop id */
	stpid: string
	/** vehicle id */
	vid: number
	/** distance (in feet) until the vehicle reaches the stop */
	dstp: number
	/** route */
	rt: string
	/** route (locale) */
	rtdd: string
	/** route direction */
	rtdir: string
	/** vehicle destination */
	des: string
	/** predicted timestamp */
	prdtm: string
	/** TA version of block ID */
	tablockid: string
	/** TA version of trip ID */
	tatripid: string
	/** trip ID in TA scheduling */
	origtatripno: string
	/** true if vehicle is delayed */
	dly: boolean
	dyn: DynamicActionType
	/** time left (in minutes) until vehicle arrives at stop */
	prdctdn: string
	zone: ''
	/** if prediction is the last arrival before a disruption, this is the time (in minutes) until next scheduled time */
	nbus: string
	/** route ID */
	rid: string
	/** trip id */
	tripid: string
	/** TODO: Unknown prop */
	tripdyn: number
	/** scheduled timestamp */
	schdtm: string
	/** TODO: Unknown prop */
	geoid: string
	/** index in sequence */
	seq: number
	/** passenger load */
	psgld: ''
	/** time (in seconds past midnight) of the scheduled start of trip */
	stst: number
	/** date (yyyy-mm-dd) of scheduled start of trip */
	stsd: string
	/** flag-stop information */
	flagstop: FlagStopType
}
export interface Vehicle {
	/** vehicle ID */
	vehicle: number
	lat: number
	lng: number
	/** last contact timestamp */
	time: number
	vehicleType: 'bus'
	/** altitude (in feet) */
	altitude?: number
	/** 0 deg -> north, 90 deg -> west */
	heading?: number
	/** number of GPS satellites */
	satellites?: number
	/** speed (in mph) */
	speed?: number
	vehicleGroup: 'support' | 'paratransit' | 'fixedRoute'

	routeName?: string
	routeNumber?: number
	// next stop details
	nextStopID1?: undefined
	nextStopName1?: string
	nextStopTime1?: undefined
	// next next stop details
	nextStopID2?: undefined
	nextStopName2?: string
	nextStopTime2?: undefined
	// next next next stop details
	nextStopID3?: undefined
	nextStopName3?: string
	nextStopTime3?: undefined

	blockName?: number
	directionName?: string
	routeAssignmentTs?: number

	/** can be '--' */
	pt1Address?: string
	/** estimated arrival time (seconds past midnight) */
	pt1estTime?: number
	/** scheduled arrival time (seoncd past midnight) */
	pt1schTime?: number
	pt1evtStr?: string
	/** unknown (yyyymmdd) */
	pt1ldate?: number

	/** can be '--' */
	pt2Address?: string
	/** estimated arrival time (seconds past midnight) */
	pt2estTime?: number
	/** scheduled arrival time (seoncd past midnight) */
	pt2schTime?: number
	pt2evtStr?: string
	/** unknown (yyyymmdd) */
	pt2ldate?: string

	/** can be '--' */
	pt3Address?: string
	/** estimated arrival time (seconds past midnight) */
	pt3estTime?: number
	/** scheduled arrival time (seoncd past midnight) */
	pt3schTime?: number
	pt3evtStr?: string
	/** unknown (yyyymmdd) */
	pt3ldate?: string

	/** TODO: unknown */
	lastEProbe?: number
	/** TODO: out of sight or out of service? */
	lastOOSProbe?: number
	/** Only set on paratransit vehicles */
	alarm?: number
	/** Only set on paratransit vehicles */
	odometer?: number
	/** Only set on paratransit vehicles */
	operatorId?: string
	/** Only set on paratransit vehicles */
	runId?: string
}
export class WTAClient extends BaseClient {
	constructor(key?: string) {
		super(
			(endpoint) => new URL(endpoint, 'https://api.ridewta.com'),
			(res) => res.then((res) => res.json()),
			{
				'Content-Type': 'application/json',
				...(key ? { 'X-API-KEY': key } : {}),
			},
		)
	}

	async getDetours() {
		const { detours } = await this.getEndpoint<{ detours: Detour[] }>('/detours')

		return detours
	}
	// async getNotices() {
	//
	// }
	async getRoutes() {
		const { routes } = await this.getEndpoint<{ routes: Route[] }>('/routes')

		return routes
	}
	getRoute(route: string) {
		return this.getEndpoint<Route>(`/routes/${route}`)
	}
	getBulletinsByRoute(route: string) {
		return this.getEndpoint<Bulletin[]>(`/routes/${route}/bulletins`)
	}
	getDetoursByRoute(route: string) {
		return this.getEndpoint<Detour[] | 'No detours found for that route.'>(
			`/routes/${route}/detours`,
		)
	}
	async getDirectionsByRoute(route: string) {
		const {
			'bustime-response': { directions },
		} = await this.getEndpoint<{
			'bustime-response': {
				directions: Direction[]
			}
		}>(`/routes/${route}/directions`)

		return directions
	}
	getPatternsByRoute(route: string) {
		return this.getEndpoint<Pattern[]>(`/routes/${route}/patterns`)
	}
	async getServiceBulletins() {
		const { bulletins } = await this.getEndpoint<{ bulletins: Bulletin[] }>('/servicebulletins')

		return bulletins
	}
	getStops() {
		return this.getEndpoint<Stop[]>('/stops')
	}
	async getStop(stop: string) {
		const [stop_data] = await this.getEndpoint<[Stop]>(`/stops/${stop}`)

		return stop_data
	}
	async getAttachmentsByStop(stop: string) {
		const attachment = await this.getEndpoint<`"${string}"`>(`/stops/${stop}/attachments`)

		return attachment.substring(1, attachment.length - 1)
	}
	getBulletinsByStop(stop: string) {
		return this.getEndpoint<Bulletin[]>(`/stops/${stop}/bulletins`)
	}
	async getPredictionsByStop(stop: string) {
		const {
			'bustime-response': { prd },
		} = await this.getEndpoint<{
			'bustime-response': {
				prd: Prediction[]
			}
		}>(`/stops/${stop}/predictions`)

		return prd.map(format_data)
	}
	async getVehicles() {
		const { vehicles } = await this.getEndpoint<{ vehicles: Vehicle[] }>('/vehicles')

		return vehicles.map(format_data)
	}
	async getVehicle(vehicle: string) {
		const { vehicles } = await this.getEndpoint<{ vehicles: [Vehicle] }>(`/vehicles/${vehicle}`)

		return format_data(vehicles[0])
	}
	async getPredictionsByVehicle(vehicle: string) {
		const {
			'bustime-response': { prd },
		} = await this.getEndpoint<{
			'bustime-response': {
				prd: Prediction[]
			}
		}>(`/vehicles/${vehicle}/predictions`)

		return (prd ?? []).map(format_data)
	}
	// async getVehicleByVehicleAndTimestamp(vehicle: string, timestamp: string) {

	// }
}
export const client = new WTAClient()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const format_data = <T extends Record<string, any>>(input: T) =>
	Object.entries(input).reduce(
		(acc, [key, value]) => ({
			...acc,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Yes, this is how it's meant to work. No, this is not pretty.
			[key]: value ? (Number.isNaN(+value) ? value : +value) : undefined,
		}),
		{} as T,
	)
