import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { shiftsEndpoint } from '../costants/endpoints';
import { GET } from '../costants/httpRequests';

const rows: GridRowsProp = [
  { id: 1, name: 'Hello', Lunedì: 'World' },
  { id: 2, name: 'DataGridPro', Lunedì: 'is Awesome' },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nome', minWidth: 100, maxWidth: 150, flex: 2 },
  { field: 'Lunedì', headerName: 'Lunedì', minWidth: 100, flex: 1, editable: true },
  { field: 'Martedì', headerName: 'Martedì', minWidth: 100, flex: 1 },
  { field: 'Mercoledì', headerName: 'Mercoledì', minWidth: 100, flex: 1 },
  { field: 'Giovedì', headerName: 'Giovedì', minWidth: 100, flex: 1 },
  { field: 'Venerdì', headerName: 'Venerdì', minWidth: 100, flex: 1 },
  { field: 'Sabato', headerName: 'Sabato', minWidth: 100, flex: 1 },
  { field: 'Domenica', headerName: 'Domenica', minWidth: 100, flex: 1 },
];

export default function Homepage() {
	const [isLoading, setIsLoading] = useState(true);
	const [shifts, setShifts] = useState<Array<{ [key: string]: any }>>([]);
	const [columns, setColumns] = useState<GridColDef[]>([]);
	const [rows, setRows] = useState<GridRowsProp>([]);

	// GETTING AND SETTING SHIFTS
	useEffect(() => {
		getShifts();
	}, []);

	const getShifts = async () => {
		try {
			const data = await GET(shiftsEndpoint);
			setShifts(data);
			setIsLoading(false);
		} catch {
			setIsLoading(false);
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		}
	};

	useEffect(() => {
	}, []);

	// PAGE
	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	}

  return (
    <Box
			width={"90%"}
			height={"100%"}
		>
			<Typography variant={"h3"} color={"primary"} fontWeight={800} textAlign={"center"} margin={"40px"}>
				HOMEPAGE
			</Typography>
			<Box
				height={"500px"}
			>
      	<DataGrid rows={rows} columns={columns}/>
			</Box>
    </Box>
  );
}
