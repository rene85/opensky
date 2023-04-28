import { Model, flightsPerHour, topOriginCountries } from '../model/model'
import { hourInterval } from '../util/date'
import { FlightsPerHour } from '../view/flightsPerHourTable'

export interface Viewmodel {
    flightsPerHour: FlightsPerHour[]
    topCountriesOfOrigin: string[]
}

// TODO: remove magic number(s)
export const inflateViewmodel = (m: Model): Viewmodel => ({
    flightsPerHour: Array.from(flightsPerHour(m.states)).map(
        ([hour, flights]) => ({
            hour: hourInterval(hour),
            numFlights: flights.length,
        })
    ),
    topCountriesOfOrigin: topOriginCountries(m.states, 3),
})
