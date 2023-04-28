import { describe, expect, test } from 'vitest'
import { utcString } from './date'

describe('format timestamps', () => {
    test('4 digit year', () =>
        expect(utcString([2023, 4, 27])).to.equal('2023-04-27T00:00:00.000Z'))

    test('2 digit year', () =>
        expect(utcString([42, 4, 27])).to.equal('0042-04-27T00:00:00.000Z'))

    test('2 digit hour', () =>
        expect(utcString([2023, 4, 27, 19, 36, 42, 123])).to.equal(
            '2023-04-27T19:36:42.123Z'
        ))

    test('1 digit hour', () =>
        expect(utcString([2023, 4, 27, 9, 36, 42, 123])).to.equal(
            '2023-04-27T09:36:42.123Z'
        ))
})
