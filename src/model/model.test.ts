import { describe, expect, test } from 'vitest'
import { StateVector } from '../opensky/stateVector'
import { topOriginCountries } from './model'

const icao24 = (label: string) => `icao24:${label}`

const callsign = (label: string | null) => `callsign:${label ? label : ''}`

const states = (): StateVector[] => [
    [icao24('A'), callsign('1'), 'JP'],
    [icao24('B'), callsign('2'), 'NL'],
    [icao24('C'), callsign('3'), 'UK'],
    [icao24('D'), callsign('4'), 'BE'],
    [icao24('E'), callsign('5'), 'JP'],
    [icao24('F'), callsign('6'), 'UK'],
    [icao24('G'), callsign('7'), 'JP'],
    [icao24('H'), callsign('8'), 'NL'],
    [icao24('I'), callsign('9'), 'UK'],
]

describe('show top 3 countries of origin', () => {
    test('top 3', () =>
        expect(topOriginCountries(states(), 3)).to.eql(['JP', 'UK', 'NL']))
})
