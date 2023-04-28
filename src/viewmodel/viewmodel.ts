import {
    Model,
    flightsPerAltitudeSlice,
    flightsPerHour,
    topOriginCountries,
} from '../model/model'
import { hourInterval } from '../util/date'
import { FlightsAtAltitude } from '../view/flightsPerAltitudeTable'
import { FlightsPerHour } from '../view/flightsPerHourTable'

export interface Viewmodel {
    flightsPerHour: FlightsPerHour[]
    topCountriesOfOrigin: string[]
    flightsAtAltitude: FlightsAtAltitude[]
}

const sliceMeters = 1000

// TODO: remove magic number(s)
export const inflateViewmodel = (m: Model): Viewmodel => ({
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
        flights,
    })),
})
