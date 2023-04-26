import { describe, expect, test } from 'vitest'
import {
    flightsPerAltitudeSlice,
    topOriginCountries,
    willSwitchLayer,
} from './model'

describe('show top 3 countries of origin', () => {
    const states = [
        ['A', '1', 'JP'],
        ['B', '2', 'NL'],
        ['C', '3', 'UK'],
        ['D', '4', 'BE'],
        ['E', '5', 'JP'],
        ['F', '6', 'UK'],
        ['G', '7', 'JP'],
        ['H', '8', 'NL'],
        ['I', '9', 'UK'],
    ]

    test('top 3', () =>
        expect(topOriginCountries(states, 3)).to.eql(['JP', 'UK', 'NL']))
})

describe('show which flights are part of an altitude slice', () => {
    const km = 1000 // meters
    const a1 = ['A', '1', 'JP', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 43 * km]
    const b2 = ['B', '2', 'NL', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 42 * km]
    const c3 = ['C', '3', 'UK', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 43 * km - 1]
    const d4 = ['D', '4', 'BE', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1337100]
    const e5 = ['E', '5', 'JP', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1337 * km]
    const f6 = ['F', '6', 'UK', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, null]
    const g7 = ['G', '7', 'JP', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1337 * km + 1]
    const h8 = ['H', '8', 'NL', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 42 * km]
    const i9 = ['I', '9', 'UK', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1337 * km]
    const states = [a1, b2, c3, d4, e5, f6, g7, h8, i9]

    test('slices of 1 km', () =>
        expect(Array.from(flightsPerAltitudeSlice(states, 1 * km))).to.eql([
            [43 * km, [a1]],
            [42 * km, [b2, c3, h8]],
            [1337 * km, [d4, e5, g7, i9]],
        ]))
})

describe('show flights that will switch altitude layer soon', () => {
    const a1 = ['A', '1', 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 12, 42500]
    const b2 = ['B', '2', 2, 3, 4, 5, 6, 7, 8, 9, 10, -50, 12, 42500]
    const c3 = ['C', '3', 2, 3, 4, 5, 6, 7, 8, 9, 10, -50, 12, 42499]
    const states = [a1, b2, c3]

    const layerSize = 1000
    const timespan = 10

    test('layers of 1 km', () =>
        expect(willSwitchLayer(states, layerSize, timespan)).to.eql([a1, c3]))
})
