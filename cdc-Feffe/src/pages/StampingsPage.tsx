import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { GET } from '../constants/httpRequests';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { DataGrid, GridColDef, GridRowId, GridRowsProp, useGridApiRef } from '@mui/x-data-grid';
import { timbratureEndpoint } from '../constants/endpoints';

interface Stamping {
	IDTimbratura: number,
	ingresso: string,
	uscita: string,
}

interface Shift {
	ID: number,
	nomeCognome: string,
	nomeTurno?: string,
	oreTotali?: number,
	oreVerificate?: number,
	note?: string,
	Timbrature?: Array<Stamping>,
}

interface ShiftsTableRow {
	id: number,
	name: string,
	shiftType?: string,
	reportedHours?: number,
	confirmedHours?: number,
	note?: string,
}

interface StampingsTableRow {
	id: number,
	entrance: string,
	exit: string,
	hourCount: string,
}

export default function ShiftsPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [date, setDate] = useState<Dayjs | null>(dayjs());
	const [shifts, setShifts] = useState<Shift[]>([]);
	const [stampings, setStampings] = useState<Array<Stamping>>([]);
	const apiRef = useGridApiRef();

	const shiftsColumns: GridColDef[] = [
		{
			field: 'name', headerName: 'NOME', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'shiftType', headerName: 'TURNO', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'reportedHours', headerName: 'Ore segnalate', minWidth: 100, maxWidth: 150, flex: 1,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'confirmedHours', headerName: 'Ore verificate', minWidth: 100, maxWidth: 150, flex: 1,
			headerAlign: "center", headerClassName: "header", editable: true,
		},
		{
			field: 'note', headerName: 'Nota', minWidth: 100, flex: 3,
			headerAlign: "center", headerClassName: "header", editable: true,
		},
	];

	const stampingsColumns: GridColDef[] = [
		{
			field: 'entrance', headerName: 'Ingresso', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'exit', headerName: 'Uscita', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'hourCount', headerName: 'Totale', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
	];

	// SHIFTS ROWS ADAPTATION
	const transformDataForTable = () => {
		if (!shifts.length) return [];

		const transformedRows = shifts.map((shift) => {
			const row: ShiftsTableRow = {
				id: shift.ID,
				name: shift.nomeCognome,
				shiftType: shift.nomeTurno,
				reportedHours: shift.oreTotali || 0,
				confirmedHours:	shift.oreVerificate || 0,
				note: shift.note,
			};

			return row;
		});

		return transformedRows;
	};

	const shiftsRows: GridRowsProp = transformDataForTable();

	// STAMPINGS ROWS ADAPTATION
	const transformDataForStampingsTable = () => {
		if (!stampings.length) return [];

		const transformedRows = stampings.map((stamping) => {
			const ingresso = dayjs(stamping.ingresso, "HH:mm:ss");
			const uscita = dayjs(stamping.uscita, "HH:mm:ss");

			const diffInMinutes = uscita.diff(ingresso, "seconds");
			const hours = Math.floor(diffInMinutes / 60 / 60);
			const minutes = Math.floor(diffInMinutes / 60);
			const seconds = diffInMinutes % 60;

			const hourCount = `${hours} ore ${minutes} min ${seconds} sec`;

			const row: StampingsTableRow = {
				id: stamping.IDTimbratura,
				entrance: stamping.ingresso,
				exit: stamping.uscita,
				hourCount: hourCount,
			};

			return row;
		});

		console.log(transformedRows);
		return transformedRows;
	};

	const stampingsRows: GridRowsProp = transformDataForStampingsTable();

	// GETTING AND SETTING SHIFTS
	const getShifts = async () => {
		try {
			// setIsLoading(true);
			const data: {Dipendenti: Array<Shift>, NoteGiorno: string} = await GET(timbratureEndpoint, { dataInizio: date?.toISOString() });
			setShifts(data.Dipendenti);
		} catch {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getShifts();
	}, [date]);

	// HANDLING ROW SELECTION
	const [showStampingsTable, setShowStampingsTable] = useState<"block" | "none">("none");
	const [shiftsTableHeight, setShiftsTableHeight] = useState<"auto" | "200px">("auto");

	const handleRowSelection = (rowId: GridRowId) => {
		const selectedStamping: Array<Stamping> = shifts.find(shift => shift.ID === rowId)?.Timbrature || [];

		if (selectedStamping[0]){
			setStampings(selectedStamping);
			setShiftsTableHeight("200px");
			setShowStampingsTable("block");
		}
		else {
			setShiftsTableHeight("auto");
			setShowStampingsTable("none");
		}
	}

	// PAGE
	const theme = useTheme();

	return (
		<Box
			width={"100%"}
			height={"100%"}
			padding={"40px 5%"}
			display={"flex"}
			flexDirection={"column"}
			alignItems={"center"}
			gap={"20px"}
			sx={{
				'& .header': {
					backgroundColor: theme.palette.secondary.main,
					color: 'black',
				},
				'& .MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
					outline: "none !important",
				}
			}}
		>
			<Typography variant={"h2"} color={"primary"} fontWeight={800} textAlign={"center"} gutterBottom>
				TIMBRATURE
			</Typography>
			<Box display="flex" gap="20px" alignItems="center">
				<Typography>Giorno selezionato:</Typography>
				<DatePicker
					value={date}
					onChange={(date) => setDate(date)}
					format="DD MMMM YYYY"
					maxDate={dayjs()}
				/>
				<Button
					onClick={() => setDate(dayjs())}
					variant="outlined"
				>
					Oggi
				</Button>
			</Box>
			<Box height={shiftsTableHeight} maxHeight={"500px"} width={"100%"}>
				{isLoading ?
					<Box display="flex" justifyContent="center" alignItems="center" height={"100%"}>
						<CircularProgress />
					</Box>
				:
					<DataGrid rows={shiftsRows} columns={shiftsColumns} apiRef={apiRef}
						showCellVerticalBorder
						disableRowSelectionOnClick
						checkboxSelection
						disableMultipleRowSelection
						onRowSelectionModelChange={(ids) => handleRowSelection(ids[0])}
					/>
				}
			</Box>
			<Box height={"auto"} maxHeight={"500px"} width={"100%"} display={showStampingsTable}>
					<DataGrid rows={stampingsRows} columns={stampingsColumns}
						showCellVerticalBorder
						disableRowSelectionOnClick
						disableMultipleRowSelection
					/>
			</Box>
		</Box>
	);
}