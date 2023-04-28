import { getUnixTime } from 'date-fns'
import { describe, expect, test } from 'vitest'
import { utcDate } from '../util/date'
import {
    flightsPerAltitudeSlice,
    flightsPerHour,
    topOriginCountries,
    willSwitchLayer,
} from './model'

describe('show number of flights per timespan', () => {
    const a1 = ['A', '1', 2, 3, getUnixTime(utcDate([2023, 4, 27, 0, 0]))]
    const b2 = ['B', '2', 2, 3, getUnixTime(utcDate([2023, 4, 27, 1, 59]))]
    const c3 = ['C', '3', 2, 3, getUnixTime(utcDate([2023, 4, 27, 0, 59]))]
    const d4 = ['D', '4', 2, 3, getUnixTime(utcDate([2023, 4, 27, 1, 0]))]
    const e5 = ['E', '5', 2, 3, getUnixTime(utcDate([2023, 4, 27, 1, 42]))]
    const f6 = ['F', '6', 2, 3, getUnixTime(utcDate([2023, 4, 27, 15, 32]))]
    const g7 = ['G', '7', 2, 3, getUnixTime(utcDate([2023, 4, 25, 13, 37]))]
    const h8 = ['H', '8', 2, 3, getUnixTime(utcDate([2023, 4, 27, 15, 48]))]
    const i9 = ['I', '9', 2, 3, getUnixTime(utcDate([2023, 1, 16, 8, 32]))]

    const j1early = ['J', '1', 2, 3, getUnixTime(utcDate([2023, 4, 27, 0, 0]))]
    const j1late = ['J', '1', 2, 3, getUnixTime(utcDate([2023, 4, 27, 1, 0]))]

    const states = [a1, b2, c3, d4, e5, f6, g7, h8, i9]

    const duplicates = [j1early, j1early, j1late]

    test('per hour', () =>
        expect(Array.from(flightsPerHour(states))).to.eql([
            [utcDate([2023, 4, 27, 0, 0]), [a1, c3]],
            [utcDate([2023, 4, 27, 1, 0]), [b2, d4, e5]],
            [utcDate([2023, 4, 27, 15, 0]), [f6, h8]],
            [utcDate([2023, 4, 25, 13, 0]), [g7]],
            [utcDate([2023, 1, 16, 8, 0]), [i9]],
        ]))

    test('count every flight once per timespan', () =>
        expect(Array.from(flightsPerHour(duplicates))).to.eql([
            [utcDate([2023, 4, 27, 0, 0]), [j1early]],
            [utcDate([2023, 4, 27, 1, 0]), [j1late]],
        ]))
})

describe('show top 3 countries of origin', () => {
    const a1 = ['A', '1', 'JP']
    const b2 = ['B', '2', 'NL']
    const e5 = ['E', '5', 'JP']

    const states = [
        a1,
        b2,
        ['C', '3', 'UK'],
        ['D', '4', 'BE'],
        e5,
        ['F', '6', 'UK'],
        ['G', '7', 'JP'],
        ['H', '8', 'NL'],
        ['I', '9', 'UK'],
    ]

    const duplicates = [a1, b2, b2, b2, e5]

    test('top 3', () =>
        expect(topOriginCountries(states, 3)).to.eql(['JP', 'UK', 'NL']))

    test('count unique flights', () =>
        expect(topOriginCountries(duplicates, 3)).to.eql(['JP', 'NL']))
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

    const a1moved = ['A', '1', 'JP', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 44 * km]

    const states = [a1, b2, c3, d4, e5, f6, g7, h8, i9]

    const duplicates = [a1, a1moved, b2]

    test('slices of 1 km', () =>
        expect(
            Array.from(flightsPerAltitudeSlice(states, 1 * km)).reverse()
        ).to.eql([
            [43 * km, [a1]],
            [42 * km, [b2, c3, h8]],
            [1337 * km, [d4, e5, g7, i9]],
        ]))

    test('count unique flights', () =>
        expect(
            Array.from(flightsPerAltitudeSlice(duplicates, 1 * km)).reverse()
        ).to.eql([
            [44 * km, [a1moved]],
            [42 * km, [b2]],
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
