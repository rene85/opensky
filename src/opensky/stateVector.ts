import { identifier } from '../model/identifier'

export type StateVector = VectorElement[]

type VectorElement = boolean | number | string | null

const indices = () => ({
    icao24: 0,
    callsign: 1,
    originCountry: 2,
})

export const id = (s: StateVector) => identifier(`${icao24(s)}:${callsign(s)}`)

export const icao24 = (s: StateVector) => s[indices().icao24] as string

export const callsign = (s: StateVector) =>
    s[indices().callsign] as string | null

export const originCountry = (s: StateVector) =>
    s[indices().originCountry] as string
