import { OpenSkyResponse } from '../opensky/response'
import {
    StateVector,
    callsign,
    id,
    originCountry,
} from '../opensky/stateVector'
import { emptyMap, updateOrDefaultMUTATE } from '../util/map'
import { Identifier } from './identifier'

type AircraftIdentityString = string
type OriginCountry = string

export interface Model {
    callsigns: [Identifier, string][]
}

export const init = (): Model => ({
    callsigns: [],
})

// TODO: filter duplicate icao24
export const withGetAllStatesResponse = (
    m: Model,
    response: OpenSkyResponse
): Model => ({
    ...m,
    callsigns: response.states.map((state) => [id(state), callsign(state)]),
})

export const topOriginCountries = (
    states: StateVector[],
    top: number
): string[] => {
    const uniqueAircraft = states.reduce(
        (uniqueAircraft, aircraft) =>
            uniqueAircraft.set(id(aircraft).string, aircraft),
        emptyMap<AircraftIdentityString, StateVector>()
    )
    const countryCount = emptyMap<OriginCountry, number>()
    for (const aircraft of uniqueAircraft.values())
        updateOrDefaultMUTATE(
            countryCount,
            originCountry(aircraft),
            (count) => count + 1,
            1
        )
    return Array.from(countryCount.entries())
        .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
        .slice(0, top)
        .map(([country]) => country)
}
