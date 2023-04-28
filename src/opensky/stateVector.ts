import { fromUnixTime } from 'date-fns'
import { identifier } from '../model/identifier'

export type StateVector = VectorElement[]

type float = number
type int = number

type VectorElement = boolean | float | string | null

const indices = () => ({
    icao24: 0,
    callsign: 1,
    originCountry: 2,
    lastContact: 4,
    verticalRate: 11,
    geoAltitude: 13,
})

export const id = (s: StateVector) => identifier(`${icao24(s)}:${callsign(s)}`)

export const icao24 = (s: StateVector) => s[indices().icao24] as string

export const callsign = (s: StateVector) =>
    s[indices().callsign] as string | null

export const originCountry = (s: StateVector) =>
    s[indices().originCountry] as string

export const lastContact = (s: StateVector) => s[indices().lastContact] as int

export const lastContactDate = (s: StateVector) => fromUnixTime(lastContact(s))

export const verticalRate = (s: StateVector) =>
    s[indices().verticalRate] as float | null

export const geoAltitude = (s: StateVector) =>
    s[indices().geoAltitude] as float | null
