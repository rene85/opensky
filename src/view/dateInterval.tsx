import { formatISO } from 'date-fns'

export interface DateInterval {
    interval: Interval
}

export const DateInterval = ({ interval }: DateInterval) => (
    <>
        {formatISO(interval.start)}
        <br />
        {formatISO(interval.end)}
    </>
)
