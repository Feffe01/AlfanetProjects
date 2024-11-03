import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridRowsProp, GridColDef, GridColumnMenuProps, GridColumnMenu, GridCellParams, GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { shiftsEndpoint, shiftTypesEndpoint } from '../constants/endpoints'; // Assuming you have an updateShiftEndpoint
import { GET, PUT } from '../constants/httpRequests';
import WeekPicker from '../components/WeekPicker';
import dayjs, { Dayjs } from 'dayjs';

interface ShiftType {
	ID: number;
	Nome: string;
	color: string;
}

interface Shift {
	ID: number;
	Nome: string;
	Cognome: string;
	turni: Array<{
		id: number;
		Data: string;
		NomeGiorno: string;
		Id_turno: number;
		nome_turno: string;
	}>;
}

interface Activity {
	IDTimbratura: number,
	ingresso: string,
	uscita: string,
}

interface ActivitiesTableRow {
	id: number,
	entrance: string,
	exit: string,
	hourCount: string,
}

function CustomColumnMenu(props: GridColumnMenuProps) {
	return (
		<GridColumnMenu
			{...props}
			slots={{
				columnMenuColumnsItem: null,
			}}
		/>
	);
}

export default function ShiftsPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [shifts, setShifts] = useState<Shift[]>([]);
	const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
	const [weekStart, setWeekStart] = useState<Dayjs | null>(dayjs().startOf('isoWeek'));

	const columns: GridColDef[] = [
		{
			field: 'name', headerName: 'NOME', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'Lunedì', headerName: 'LUNEDÌ',
			renderHeader: () => (
				<span style={{ textAlign: "center" }}>
					{shifts[0]?.turni[0]?.NomeGiorno}<br />
					{shifts[0]?.turni[0]?.Data}
				</span>
			), minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'Martedì', headerName: 'MARTEDÌ',
			renderHeader: () => (
				<span style={{ textAlign: "center" }}>
					{shifts[0]?.turni[1]?.NomeGiorno}<br />
					{shifts[0]?.turni[1]?.Data}
				</span>
			), minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'Mercoledì', headerName: 'MERCOLEDÌ',
			renderHeader: () => (
				<span style={{ textAlign: "center" }}>
					{shifts[0]?.turni[2]?.NomeGiorno}<br />
					{shifts[0]?.turni[2]?.Data}
				</span>
			), minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'Giovedì', headerName: 'GIOVEDÌ',
			renderHeader: () => (
				<span style={{ textAlign: "center" }}>
					{shifts[0]?.turni[3]?.NomeGiorno}<br />
					{shifts[0]?.turni[3]?.Data}
				</span>
			), minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'Venerdì', headerName: 'VENERDÌ',
			renderHeader: () => (
				<span style={{ textAlign: "center" }}>
					{shifts[0]?.turni[4]?.NomeGiorno}<br />
					{shifts[0]?.turni[4]?.Data}
				</span>
			), minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'Sabato', headerName: 'SABATO',
			renderHeader: () => (
				<span style={{ textAlign: "center" }}>
					{shifts[0]?.turni[5]?.NomeGiorno}<br />
					{shifts[0]?.turni[5]?.Data}
				</span>
			), minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'Domenica', headerName: 'DOMENICA',
			renderHeader: () => (
				<span style={{ textAlign: "center" }}>
					{shifts[0]?.turni[6]?.NomeGiorno}<br />
					{shifts[0]?.turni[6]?.Data}
				</span>
			), minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
			headerAlign: "center", headerClassName: "header",
		},
	];

	// GETTING AND SETTING SHIFTS TYPES
	const getShiftTypes = async () => {
		try {
			GET(shiftTypesEndpoint, null, setShiftTypes);
		} catch {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		}
	}

	useEffect(() => {
		getShiftTypes();
	}, []);

	// GETTING AND SETTING SHIFTS
	const getShifts = async () => {
		try {
			// setIsLoading(true);
			await GET(shiftsEndpoint, { dataInizio: weekStart?.format("DD/MM/YYYY") }, setShifts);
		} catch {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getShifts();
	}, [weekStart]);

	const transformDataForTable = () => {
		if (!shifts.length) return [];

		const daysOfWeek = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

		const transformedRows = shifts.map((shift) => {
			const row: { [key: string]: any } = { id: shift.ID, name: `${shift.Nome} ${shift.Cognome}` };

			daysOfWeek.forEach(day => {
				const dayShift = shift.turni.find(turno => turno.NomeGiorno === day);
				row[day] = dayShift ? dayShift.nome_turno : '';
			});

			return row;
		});

		return transformedRows;
	};

	const rows: GridRowsProp = transformDataForTable();

	// HANDLING ROW UPDATE
	const processRowUpdate = async (newRow: any) => {
		// Find the shift corresponding to the updated row
		const shiftToUpdate = shifts.find(shift => shift.ID === newRow.id);
		if (!shiftToUpdate) return newRow;

		// Update the turni array with the new value
		const updatedTurni = shiftToUpdate.turni.map(turno => {
			const dayName = Object.keys(newRow).find(key => key !== 'id' && key !== 'name' && key === turno.NomeGiorno);
			if (dayName) {
				const selectedShiftType = newRow[dayName];
				const selectedShiftTypeObj = shiftTypes.find(type => type.Nome === selectedShiftType);

				return {
					...turno,
					nome_turno: selectedShiftType,
					Id_turno: selectedShiftTypeObj ? selectedShiftTypeObj.ID : turno.Id_turno,
				};
			}
			return turno;
		});

		// Create a new shift object with updated turni
		const updatedShift = { ...shiftToUpdate, turni: updatedTurni };

		// Update the local state
		const updatedShifts = shifts.map(shift => (shift.ID === updatedShift.ID ? updatedShift : shift));
		setShifts(updatedShifts);

		// Prepare and send the PUT request
		try {
			await PUT(shiftsEndpoint, updatedShifts);
			console.log(`Shift updated successfully: ${newRow.id}`);
		} catch (error) {
			console.error("Error updating shift: ", error);
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
			return newRow;
		}

		return { ...newRow };
	};

	// SECOND TABLE
	// HANDLING ROW SELECTION

	const [activities, setActivities] = useState<Array<Activity>>([]);

	const activitiesColumns: GridColDef[] = [
		{
			field: 'name', headerName: '', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'hours', headerName: 'Ore', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'target', headerName: 'Target', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'space', headerName: '', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'insertedProd', headerName: 'Produzione Inserita', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'verifiedProd', headerName: 'Produzione Verificata', minWidth: 100, maxWidth: 150, flex: 2,
			headerAlign: "center", headerClassName: "header",
		},
	];

	// STAMPINGS ROWS ADAPTATION
	const transformDataForActivitiesTable = () => {
		if (!activities.length) return [];

		const transformedRows = activities.map((activity) => {
			const ingresso = dayjs(activity.ingresso, "HH:mm:ss");
			const uscita = dayjs(activity.uscita, "HH:mm:ss");

			const diffInMinutes = uscita.diff(ingresso, "seconds");
			const hours = Math.floor(diffInMinutes / 60 / 60);
			const minutes = Math.floor(diffInMinutes / 60);
			const seconds = diffInMinutes % 60;

			const hourCount = `${hours} ore ${minutes} min ${seconds} sec`;

			const row: ActivitiesTableRow = {
				id: activity.IDTimbratura,
				entrance: activity.ingresso,
				exit: activity.uscita,
				hourCount: hourCount,
			};

			return row;
		});

		console.log(transformedRows);
		return transformedRows;
	};

	const activitiesRows: GridRowsProp = transformDataForActivitiesTable();

	const [showActivitiesTable, setShowActivitiesTable] = useState<"block" | "none">("none");
	const [shiftsTableHeight, setShiftsTableHeight] = useState<"auto" | "200px">("auto");

	const handleRowSelection = (rowId: GridRowId) => {
		const selectedActivity: Array<Activity> = shifts.find(shift => shift.ID === rowId)?.Timbrature || [];

		if (selectedActivity[0]) {
			setActivities(selectedActivity);
			setShiftsTableHeight("200px");
			setShowActivitiesTable("block");
		}
		else {
			setShiftsTableHeight("auto");
			setShowActivitiesTable("none");
		}
	}

	// PAGE
	const theme = useTheme();

	return (
		<Box
			width={"100%"} height={"100%"} padding={"40px 5%"}
			display={"flex"} flexDirection={"column"} alignItems={"center"} gap={"20px"}
			sx={{
				'& .header': {
					backgroundColor: theme.palette.secondary.main,
					color: 'black',
				},
				'& .MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
					outline: "none !important",
				},
				'& .Mattina': {
					backgroundColor: shiftTypes.find(ShiftType => ShiftType.Nome === "Mattina")?.color || 'transparent',
					color: 'black',
				},
				'& .Pomeriggio': {
					backgroundColor: shiftTypes.find(ShiftType => ShiftType.Nome === "Pomeriggio")?.color || 'transparent',
					color: 'black',
				},
				'& .Notturno': {
					backgroundColor: shiftTypes.find(ShiftType => ShiftType.Nome === "Notturno")?.color || 'transparent',
					color: 'black',
				},
				'& .tempo-pieno': {
					backgroundColor: shiftTypes.find(ShiftType => ShiftType.Nome === "Tempo Pieno")?.color || 'transparent',
					color: 'black',
				},
			}}
		>
			<Typography variant={"h2"} color={"primary"} fontWeight={800} textAlign={"center"} gutterBottom>
				TABELLA TURNI
			</Typography>
			<WeekPicker onWeekChange={(startOfWeek: Dayjs) => setWeekStart(startOfWeek)} />
			<Box height={shiftsTableHeight} maxHeight={"500px"} width={"100%"}>
				{isLoading ?
					<Box display="flex" justifyContent="center" alignItems="center" height={"100%"}>
						<CircularProgress />
					</Box>
					:
					<DataGrid rows={rows} columns={columns}
						slots={{ columnMenu: CustomColumnMenu }}
						showCellVerticalBorder
						getCellClassName={(params: GridCellParams<any, any, number>) => {
							if (params.value === "Tempo Pieno")
								return "tempo-pieno";
							return params.value;
						}}
						processRowUpdate={processRowUpdate}
						disableRowSelectionOnClick
						checkboxSelection
						disableMultipleRowSelection
					/>
				}
			</Box>
			<Box height={"auto"} maxHeight={"500px"} width={"100%"} display={showActivitiesTable}>
				<DataGrid rows={activitiesRows} columns={activitiesColumns}
					showCellVerticalBorder
					disableRowSelectionOnClick
					disableMultipleRowSelection
				/>
			</Box>
		</Box>
	);
}
