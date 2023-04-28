import { endOfHour, getTime, startOfHour } from 'date-fns'

interface DateRecord {
    year: number
    month: number
    day: number
    hour?: number
    minute?: number
    second?: number
    millis?: number
}

type DateTuple = [number, number, number, number?, number?, number?, number?]

const record = ([
    year,
    month,
    day,
    hour,
    minute,
    second,
    millis,
]: DateTuple): DateRecord => ({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millis,
})

export const utcDate = (date: DateRecord | DateTuple) =>
    new Date(utcString(date))

export const utcString = (date: DateRecord | DateTuple) => {
    const rec = Array.isArray(date) ? record(date) : date
    const { year, month, day, hour, minute, second: sec, millis: mil } = rec
    const d = `${fmt(year, 4)}-${fmt(month, 2)}-${fmt(day, 2)}`
    const t = `${fmt(hour, 2)}:${fmt(minute, 2)}:${fmt(sec, 2)}.${fmt(mil, 3)}`
    return `${d}T${t}Z`
}

const fmt = (value: number | undefined, minNumDigits: number): string => {
    const val = value || 0
    const sign = val < 0 ? '-' : ''
    const mag = `${Math.abs(val)}`
    const padding = '0'.repeat(Math.max(0, minNumDigits - mag.length))
    return `${sign}${padding}${mag}`
}

// Start and end are inclusive
export const hourInterval = (withinHour: Date): Interval => ({
    start: startOfHour(withinHour),
    end: endOfHour(withinHour),
})

export const intervalKey = ({ start, end }: Interval) =>
    `${getTime(start)}_${getTime(end)}`
