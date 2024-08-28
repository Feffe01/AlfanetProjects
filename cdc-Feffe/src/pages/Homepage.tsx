import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridRowsProp, GridColDef, GridColumnMenuProps, GridColumnMenu, GridCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { shiftsEndpoint, shiftTypesEndpoint } from '../costants/endpoints'; // Assuming you have an updateShiftEndpoint
import { GET, PUT } from '../costants/httpRequests';
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
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [weekStart, setWeekStart] = useState<Dayjs | null>(dayjs().startOf('isoWeek'));

  const columns: GridColDef[] = [
    {
      field: 'name', headerName: 'NOME', minWidth: 100, maxWidth: 150, flex: 2,
      headerAlign: "center", headerClassName: "header",
    },
    {
      field: 'Lunedì', headerName: 'LUNEDÌ', minWidth: 100, maxWidth: 150, flex: 1,
      editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
      headerAlign: "center", headerClassName: "header",
    },
    {
      field: 'Martedì', headerName: 'MARTEDÌ', minWidth: 100, maxWidth: 150, flex: 1,
      editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
      headerAlign: "center", headerClassName: "header",
    },
    {
      field: 'Mercoledì', headerName: 'MERCOLEDÌ', minWidth: 100, maxWidth: 150, flex: 1,
      editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
      headerAlign: "center", headerClassName: "header",
    },
    {
      field: 'Giovedì', headerName: 'GIOVEDÌ', minWidth: 100, maxWidth: 150, flex: 1,
      editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
      headerAlign: "center", headerClassName: "header",
    },
    {
      field: 'Venerdì', headerName: 'VENERDÌ', minWidth: 100, maxWidth: 150, flex: 1,
      editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
      headerAlign: "center", headerClassName: "header",
    },
    {
      field: 'Sabato', headerName: 'SABATO', minWidth: 100, maxWidth: 150, flex: 1,
      editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
      headerAlign: "center", headerClassName: "header",
    },
    {
      field: 'Domenica', headerName: 'DOMENICA', minWidth: 100, maxWidth: 150, flex: 1,
      editable: true, type: 'singleSelect', valueOptions: shiftTypes.map(type => type.Nome),
      headerAlign: "center", headerClassName: "header",
    },
  ];

  // GETTING AND SETTING SHIFTS TYPES
  useEffect(() => {
    getShiftTypes();
  }, []);

  const getShiftTypes = async () => {
    try {
      const data: ShiftType[] = await GET(shiftTypesEndpoint);
      setShiftTypes(data);
    } catch {
      alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
    }
  }

  // GETTING AND SETTING SHIFTS
  useEffect(() => {
    getShifts();
  }, [weekStart]);

  const getShifts = async () => {
    try {
      const data: Shift[] = await GET(shiftsEndpoint, { dataInizio: weekStart?.format("DD/MM/YYYY") });
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

    const transformedRows = shifts.map((shift) => {
      const row: { [key: string]: any } = { id: shift.ID, name: shift.Nome + " " + shift.Cognome };

      daysOfWeek.forEach(day => {
        const dayShift = shift.turni.find(turno => turno.NomeGiorno === day);
        row[day] = dayShift ? dayShift.nome_turno : '';
      });

      return row;
    });

    setRows(transformedRows);
  }, [shifts]);

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

  // PAGE
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

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
      <Box height={"500px"} width={"100%"}>
        <DataGrid rows={rows} columns={columns}
          slots={{ columnMenu: CustomColumnMenu }}
          showCellVerticalBorder
          getCellClassName={(params: GridCellParams<any, any, number>) => {
            if (params.value === "Tempo Pieno")
              return "tempo-pieno";
            return params.value;
          }}
          processRowUpdate={processRowUpdate}
        />
      </Box>
    </Box>
  );
}
