import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

interface TopCountriesOfOrigin {
    countries: string[]
}

export function TopCountriesOfOrigin({ countries }: TopCountriesOfOrigin) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Top countries of origin</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {countries.map((row) => (
                        <TableRow key={row}>
                            <TableCell>{row}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
