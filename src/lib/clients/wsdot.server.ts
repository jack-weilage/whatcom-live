import { WSDOT_API_KEY } from '$env/static/private'

export type WSDOTTimestamp = `/Date(${number}-${number})/`
interface RoadwayLocation {
	Description?: string
	Direction: null
	Latitude: number
	Longitude: number
	MilePost: number
	RoadName: string
}
export interface BorderCrossing {
	BorderCrossingLocation?: RoadwayLocation
	CrossingName: string
	Time: WSDOTTimestamp
	WaitTime: number
}
export interface Alert {
	AlertID: number
	County: null
	EndRoadwayLocation: RoadwayLocation
	Endtime?: WSDOTTimestamp
	//TODO: Could be an enum, but too big for rn
	EventCategory: string
	EventStatus: 'Open'
	ExtendedDescription: string
	HeadlineDescription: string
	LastUpdatedTime: WSDOTTimestamp
	Priority: 'Low' | 'Medium' | 'High'
	Region: string
	StartRoadwayLocation: RoadwayLocation
	StartTime: WSDOTTimestamp
}
export interface Camera {
	CameraID: number
	CameraLocation: RoadwayLocation
	CameraOwner: string
	Description?: string
	DisplayLatitude: number
	DisplayLongitude: number
	ImageHeight: number
	ImageURL: string
	ImageWidth: number
	IsActive: boolean
	OwnerURL?: string
	Region: string
	SortOrder: number
	Title: string
}

export class WSDOTTrafficClient {
	#key: string

	constructor(key: string) {
		this.#key = key
	}

	async #get_endpoint<T>(endpoint: string) {
		const headers = new Headers({
			'Content-Type': 'application/json',
			'User-Agent': 'whatcom-live/0.0.0',
		})

		const response = await fetch(
			'https://www.wsdot.wa.gov/Traffic/api' + endpoint + `?AccessCode=${this.#key}`,
			{ headers },
		)

		return response.json() as Promise<T>
	}

	async getBorderCrossings() {
		const crossings = await this.#get_endpoint<BorderCrossing[]>(
			'/BorderCrossings/BorderCrossingsREST.svc/GetBorderCrossingsAsJson',
		)

		return crossings
	}
	async getAlerts() {
		const alerts = await this.#get_endpoint<Alert[]>(
			'/HighwayAlerts/HighwayAlertsREST.svc/GetAlertsAsJson',
		)

		return alerts
	}
	async getCameras() {
		const cameras = await this.#get_endpoint<Camera[]>(
			'/HighwayCameras/HighwayCamerasREST.svc/GetCamerasAsJson',
		)

		return cameras
	}
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const client = new WSDOTTrafficClient(WSDOT_API_KEY)
