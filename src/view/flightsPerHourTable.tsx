import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { intervalKey } from '../util/date'
import { DateInterval } from './dateInterval'

interface FlightsPerHourTable {
    data: FlightsPerHour[]
}

export interface FlightsPerHour {
    hour: Interval
    numFlights: number
}

export function FlightsPerHourTable({ data }: FlightsPerHourTable) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell align="right">Flights</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={intervalKey(row.hour)}>
                            <TableCell component="th" scope="row">
                                <DateInterval interval={row.hour} />
                            </TableCell>
                            <TableCell align="right">
                                {row.numFlights}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
