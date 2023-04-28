import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { StateVector, id } from '../opensky/stateVector'

interface FlightsPerAltitudeTable {
    data: FlightsAtAltitude[]
}

export interface FlightsAtAltitude {
    altitude: AltitudeLayer
    flights: StateVector[]
}

type AltitudeLayer = [number, number]

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
                                        <li>{id(flight).string}</li>
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
