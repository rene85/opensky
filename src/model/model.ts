import { fromUnixTime, getUnixTime, startOfHour } from 'date-fns'
import { OpenSkyResponse } from '../opensky/response'
import {
    StateVector,
    callsign,
    geoAltitude,
    id,
    lastContactDate,
    originCountry,
    verticalRate,
} from '../opensky/stateVector'
import {
    emptyMap,
    updateOrDefaultMUTATE,
    updateWithDefaultMUTATE,
} from '../util/map'
import { Identifier } from './identifier'

type AircraftIdentityString = string
type OriginCountry = string

export interface Model {
    callsigns: [Identifier, string | null][]
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

export const flightsPerHour = (
    states: StateVector[]
): Map<Date, StateVector[]> => {
    const map = states.reduce(
        (flightsPerHour, flight) =>
            updateWithDefaultMUTATE(
                flightsPerHour,
                getUnixTime(startOfHour(lastContactDate(flight))),
                (flightsInHour) => [...flightsInHour, flight],
                []
            ),
        emptyMap<number, StateVector[]>()
    )
    const entries: [Date, StateVector[]][] = Array.from(map).map(
        ([timestamp, stateVectors]) => [fromUnixTime(timestamp), stateVectors]
    )
    return new Map(entries)
}

export const flightsPerAltitudeSlice = (
    states: StateVector[],
    sliceSizeMeters: number
): Map<number, StateVector[]> =>
    states
        .filter((flight) => geoAltitude(flight) !== null)
        .reduce<Map<number, StateVector[]>>(
            (flightsPerAltitudeSlice, flight) =>
                updateWithDefaultMUTATE(
                    flightsPerAltitudeSlice,
                    altitudeLayer(
                        geoAltitude(flight) as number,
                        sliceSizeMeters
                    ).bottom,
                    (flightsInSlice) => [...flightsInSlice, flight],
                    []
                ),
            emptyMap<number, StateVector[]>()
        )

export const willSwitchLayer = (
    states: StateVector[],
    layerSize: number, // meters
    timespan: number // seconds
): StateVector[] =>
    states
        .filter(
            (flight) =>
                geoAltitude(flight) !== null && verticalRate(flight) !== null
        )
        .filter(
            (flight) =>
                !inSameLayer(
                    [
                        geoAltitude(flight) as number,
                        (verticalRate(flight) as number) * timespan +
                            (geoAltitude(flight) as number),
                    ],
                    layerSize
                )
        )

interface AltitudeLayer {
    bottom: number // meters, inclusive
    top: number // meters, exclusive
}

const altitudeLayer = (altitude: number, layerSize: number): AltitudeLayer => {
    const bottom = Math.floor(altitude / layerSize) * layerSize
    const top = bottom + layerSize
    return { top, bottom }
}

const layerEq = (layers: AltitudeLayer[]) =>
    layers.filter(
        (layer) =>
            layers[0].bottom === layer.bottom && layers[0].top === layer.top
    ).length === layers.length

const inSameLayer = (altitudes: number[], layerSize: number) =>
    layerEq(altitudes.map((alt) => altitudeLayer(alt, layerSize)))
