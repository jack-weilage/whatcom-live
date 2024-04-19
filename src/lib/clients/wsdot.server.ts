import { WSDOT_API_KEY } from '$env/static/private'
import { BaseClient } from './base.server'

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

export class WSDOTTrafficClient extends BaseClient {
	constructor(key: string) {
		super(
			(endpoint) =>
				new URL('https://www.wsdot.wa.gov/Traffic/api' + endpoint + `?AccessCode=${key}`),
			(res) => res.then((res) => res.json()),
			{ 'Content-Type': 'application/json' },
		)
	}

	async getBorderCrossings() {
		const crossings = await this.getEndpoint<BorderCrossing[]>(
			'/BorderCrossings/BorderCrossingsREST.svc/GetBorderCrossingsAsJson',
		)

		return crossings
	}
	async getAlerts() {
		const alerts = await this.getEndpoint<Alert[]>(
			'/HighwayAlerts/HighwayAlertsREST.svc/GetAlertsAsJson',
		)

		return alerts
	}
	async getCameras() {
		const cameras = await this.getEndpoint<Camera[]>(
			'/HighwayCameras/HighwayCamerasREST.svc/GetCamerasAsJson',
		)

		return cameras
	}
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const client = new WSDOTTrafficClient(WSDOT_API_KEY)
