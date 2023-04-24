import { OpenSkyResponse } from '../opensky/response'
import { callsign, id } from '../opensky/stateVector'
import { Identifier } from './identifier'

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
