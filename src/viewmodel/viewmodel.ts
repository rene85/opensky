import {
    Model,
    flightsPerAltitudeSlice,
    flightsPerHour,
    topOriginCountries,
    willSwitchLayer,
} from '../model/model'
import { id } from '../opensky/stateVector'
import { hourInterval } from '../util/date'
import { FlightsAtAltitude } from '../view/flightsPerAltitudeTable'
import { FlightsPerHour } from '../view/flightsPerHourTable'

export interface Viewmodel {
    flightsPerHour: FlightsPerHour[]
    topCountriesOfOrigin: string[]
    flightsAtAltitude: FlightsAtAltitude[]
}

interface Options {
    pollIntervalMs: number
}

const sliceMeters = 1000

const second = 1000

// TODO: remove magic number(s)
export const inflateViewmodel = (m: Model, opts: Options): Viewmodel => {
    const ascentWarning = new Set(
        willSwitchLayer(
            m.states,
            sliceMeters,
            opts.pollIntervalMs / second
        ).map((flight) => id(flight).string)
    )
    return {
        flightsPerHour: Array.from(flightsPerHour(m.states)).map(
            ([hour, flights]) => ({
                hour: hourInterval(hour),
                numFlights: flights.length,
            })
        ),
        topCountriesOfOrigin: topOriginCountries(m.states, 3),
        flightsAtAltitude: Array.from(
            flightsPerAltitudeSlice(m.states, sliceMeters)
        ).map(([layer, flights]) => ({
            altitude: [layer, layer + sliceMeters - 1],
            flights: flights.map((state) => ({
                label: id(state).string,
                ascentWarning: ascentWarning.has(id(state).string),
            })),
        })),
    }
}
