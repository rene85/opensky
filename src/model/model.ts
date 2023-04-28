import { fromUnixTime, getUnixTime, startOfHour } from 'date-fns'
import { OpenSkyResponse } from '../opensky/response'
import {
    StateVector,
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
import { added } from '../util/set.effect'

type AircraftIdentityString = string
type OriginCountry = string

// TODO: retain as little data in the model as possible
export interface Model {
    states: StateVector[]
}

export const init = (): Model => ({
    states: [],
})

// TODO: filter duplicate icao24
export const withGetAllStatesResponse = (
    m: Model,
    response: OpenSkyResponse
): Model => ({
    ...m,
    states: [...m.states, ...response.states],
})

export const topOriginCountries = (
    states: StateVector[],
    top: number
): string[] => {
    const countryCount = emptyMap<OriginCountry, number>()
    for (const aircraft of uniqueFlights(states))
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
        ([timestamp, stateVectors]) => [
            fromUnixTime(timestamp),
            uniqueFlights(stateVectors),
        ]
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

const uniqueFlights = (flights: StateVector[]): StateVector[] => {
    const seen = new Set<string>()
    return flights.filter((flight) => added(seen, id(flight).string))
}
