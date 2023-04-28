import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

interface FlightsPerAltitudeTable {
    data: FlightsAtAltitude[]
}

export interface FlightsAtAltitude {
    altitude: AltitudeLayer
    flights: Flight[]
}

type AltitudeLayer = [number, number]

interface Flight {
    ascentWarning: boolean
    label: string
}

const layerKey = ([a, b]: AltitudeLayer) => `${a}_${b}`

export function FlightsPerAltitudeTable({ data }: FlightsPerAltitudeTable) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Altitude</TableCell>
                        <TableCell align="right">Flights</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={layerKey(row.altitude)}>
                            <TableCell component="th" scope="row">
                                {layerKey(row.altitude)}
                            </TableCell>
                            <TableCell>
                                <ul>
                                    {row.flights.map((flight) => (
                                        <li>
                                            {flight.label}
                                            {flight.ascentWarning ? (
                                                <span>warning</span>
                                            ) : null}
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
