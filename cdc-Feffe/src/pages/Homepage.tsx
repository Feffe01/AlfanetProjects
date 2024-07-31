import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef, GridColumnMenuProps, GridColumnMenu } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { shiftsEndpoint, shiftTypesEndpoint } from '../costants/endpoints';
import { GET } from '../costants/httpRequests';
import WeekPicker from '../components/WeekPicker';
import dayjs, { Dayjs } from 'dayjs';

interface ShiftType {
	ID: number;
	Nome: string;
}

interface Shift {
	id: number;
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

export default function Homepage() {
  const [isLoading, setIsLoading] = useState(true);
  const [shifts, setShifts] = useState<Shift[]>([]);
	const [shiftTypes, setShiftTypes] = useState<string[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);
	const [weekStart, setWeekStart] = useState<Dayjs | null>(dayjs().startOf('isoWeek'));
	const columns: GridColDef[] = [
		{ field: 'name', headerName: 'Nome', minWidth: 100, maxWidth: 150, flex: 2 },
		{ field: 'Lunedì', headerName: 'Lunedì', minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes, },
		{ field: 'Martedì', headerName: 'Martedì', minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes, },
		{ field: 'Mercoledì', headerName: 'Mercoledì', minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes, },
		{ field: 'Giovedì', headerName: 'Giovedì', minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes, },
		{ field: 'Venerdì', headerName: 'Venerdì', minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes, },
		{ field: 'Sabato', headerName: 'Sabato', minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes, },
		{ field: 'Domenica', headerName: 'Domenica', minWidth: 100, maxWidth: 150, flex: 1,
			editable: true, type: 'singleSelect', valueOptions: shiftTypes, },
	];

	// GETTING AND SETTING SHIFTS TYPES
	useEffect(() => {
		getShiftTypes();
	}, []);

	const getShiftTypes = async () => {
		try {
			const data: ShiftType[] = await GET(shiftTypesEndpoint);
			const types: string[] = data.map( (type) => type.Nome )
			setShiftTypes(types)
		} catch {
      alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
    }
	}

  // GETTING AND SETTING SHIFTS
  useEffect(() => {
    getShifts();
  }, [ weekStart ]);

  const getShifts = async () => {
    try {
      const data: Shift[] = await GET(shiftsEndpoint, {dataInizio: weekStart?.format("DD/MM/YYYY")});
      setShifts(data);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
    }
  };

  useEffect(() => {
    if (!shifts.length) return;

    const daysOfWeek = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

    const transformedRows = shifts.map((shift, index) => {
      const row: { [key: string]: any } = { id: index, name: shift.Nome + " " + shift.Cognome };

      daysOfWeek.forEach(day => {
        const dayShift = shift.turni.find(turno => turno.NomeGiorno === day);
        row[day] = dayShift ? dayShift.nome_turno : '';
      });

      return row;
    });

    setRows(transformedRows);
  }, [shifts]);

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
			width={"100%"} height={"100%"} padding={"40px 5%"}
			display={"flex"} flexDirection={"column"} alignItems={"center"} gap={"20px"}
		>
      <Typography variant={"h2"} color={"primary"} fontWeight={800} textAlign={"center"} gutterBottom>
        TABELLA TURNI
      </Typography>
			<WeekPicker onWeekChange={(startOfWeek: Dayjs) => setWeekStart(startOfWeek)}/>
      <Box height={"500px"} width={"100%"}>
        <DataGrid rows={rows} columns={columns} slots={{ columnMenu: CustomColumnMenu }} showCellVerticalBorder/>
      </Box>
    </Box>
  );
}
