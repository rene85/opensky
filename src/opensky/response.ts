import { StateVector } from './stateVector'

export interface OpenSkyResponse {
    time: number
    states: StateVector[]
}
