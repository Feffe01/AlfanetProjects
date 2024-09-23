import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { anagraficaEndpoint, timeoffsEndpoint, timeoffStatusesEndpoint, timeoffTypesEndpoint } from '../constants/endpoints';
import { GET, POST, PUT } from '../constants/httpRequests';
import dayjs from 'dayjs';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';

interface TimeoffType {
	ID: number,
	Nome: string,
	color: string,
}

interface TimeoffStatus {
	ID: number,
	Nome: string,
}

interface Timeoff {
	ID: number,
	ID_Tipo: number,
	tipo: string,
	dalDateTime: string,
	alDateTime: string,
	color: string,
	giornoIntero: boolean,
	idStato: number,
	motivazione: string,
	nomeCognome: string,
	stato: string,
}

interface TableRow {
	id: number,
	name: string,
	type: string,
	description: string,
	date: string,
	status: string,
}

interface Employee {
	ID: number,
	Nome: string,
	Cognome: string,
}

export default function TimeoffsPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [timeoffs, setTimeoffs] = useState<Timeoff[]>([]);
	const [timeoffTypes, setTimeoffTypes] = useState<TimeoffType[]>([]);
	const [timeoffStatuses, setTimeoffStatuses] = useState<TimeoffStatus[]>([]);
	const [openNewTimeoffDialog, setOpenNewTimeoffDialog] = useState(false);
	const [openTimeoffDialog, setOpenTimeoffDialog] = useState(false);
	const [selectedTimeoff, setSelectedTimeoff] = useState<Timeoff>();

	const columns: GridColDef[] = [
		{
			field: 'name', headerName: 'Nome', width: 150, minWidth: 100, maxWidth: 300,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'type', headerName: 'Tipologia', width: 105, minWidth: 100, maxWidth: 150,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'description', headerName: 'Motivazione', minWidth: 100, flex: 5,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'date', headerName: 'Dal - al', minWidth: 150,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'status', headerName: 'Stato', width: 130, minWidth: 100, maxWidth: 150,
			headerAlign: "center", headerClassName: "header",
		},
	];

	// GETTING AND SETTING TIMEOFFS TYPES AND STATUSES
	const getTimeoffTypes = async () => {
		try {
			const types = await GET(timeoffTypesEndpoint);
			setTimeoffTypes(types.TipoAssenze);
		} catch {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		}
	}

	const getTimeoffStatuses = async () => {
		try {
			const statuses = await GET(timeoffStatusesEndpoint);
			setTimeoffStatuses(statuses.TipoStato);
		} catch {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		}
	}

	useEffect(() => {
		getTimeoffTypes();
		getTimeoffStatuses();
	}, []);

	// GETTING AND SETTING NOTIFICATION
	const getTimeoffs = async () => {
		try {
			// setIsLoading(true);
			const data = await GET(timeoffsEndpoint);
			setTimeoffs(data.Assenze);
		} catch {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getTimeoffs();
	}, []);

	const transformDataForTable = () => {
		if (!timeoffs.length) return [];

		const transformedRows = timeoffs.map((timeoff) => {
			const date = timeoff.giornoIntero ?
				dayjs(timeoff.dalDateTime).format("DD/MM/YYYY") + " - " + dayjs(timeoff.alDateTime).format("DD/MM/YYYY")
				:
				dayjs(timeoff.dalDateTime).format("DD/MM/YYYY hh:mm") + " - " + dayjs(timeoff.alDateTime).format("DD/MM/YYYY hh:mm")

			const row: TableRow = {
				id: timeoff.ID,
				name: timeoff.nomeCognome,
				type: timeoff.tipo,
				description: timeoff.motivazione != "" ? timeoff.motivazione : "--- Non inserita ---",
				date:	date,
				status:	timeoff.stato, 
			};

			return row;
		});

		return transformedRows;
	};

	const rows: GridRowsProp = transformDataForTable();

	//ON ROW CLICK UPDATE TIMEOFF
	const handleOpenTimeoffDialog = () => setOpenTimeoffDialog(true);
	const handleCloseTimeoffDialog = () => {
		getTimeoffs();
		setOpenTimeoffDialog(false);
	}

	const handleRowClick = (row: TableRow) => {
		const selectedTimeoff = timeoffs.find(value => value.ID == row.id)
		setSelectedTimeoff(selectedTimeoff);
		handleOpenTimeoffDialog();
	}

	const updateSelectedTimeoffStatus = (newStatusId: number) => {
		const newStatusName = timeoffTypes.find(value => value.ID == newStatusId)?.Nome;

		if(newStatusName)
		{
			const updatedTimeoff = {
				...selectedTimeoff,
				idStato: newStatusId,
				stato: newStatusName,
			}

			PUT(timeoffsEndpoint, [updatedTimeoff])
		}
	}

	const updateSelectedTimeoffType = async (newTypeId: number) => {
		const newTypeName = timeoffTypes.find(value => value.ID == newTypeId)?.Nome;

		if(newTypeName)
		{
			const updatedTimeoff = {
				...selectedTimeoff,
				ID_Tipo: newTypeId,
				tipo: newTypeName,
			}

			PUT(timeoffsEndpoint, [updatedTimeoff])
		}
	}

	//CREATE NEW TIMEOFF
	const handleOpenNewTimeoffDialog = () => setOpenNewTimeoffDialog(true);
	const handleCloseNewTimeoffDialog = () => {
		getTimeoffs();
		setOpenNewTimeoffDialog(false);
	}

	const [isFullDay, setIsFullDay] = useState<boolean>(false);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setIsFullDay(event.target.checked)

	const [employees, setEmployees] = useState<Array<Employee>>([]);
	const getEmployees = async () => {
		GET (anagraficaEndpoint, null, setEmployees)
	}

	useEffect(() => {
		getEmployees();
	}, []);

	const sendNewTimeoff = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries((formData as any).entries());
		const employee = employees.find(employee => employee.ID == formJson.employeeId)
		const status = timeoffStatuses.find(status => status.ID == formJson.statusId)
		const type = timeoffTypes.find(type => type.ID == formJson.typeId)

		if(employee && status && type)
		{
			const employeeData = {
				ID_Anagrafica: employee.ID,
				nome: employee.Nome,
				cognome: employee.Cognome,
				nomeCognome: `${employee.Nome} ${employee.Cognome}`
			}
			const statusData = {
				idStato: status.ID,
				stato: status.Nome,
			};
			const typeData = {
				ID_Tipo: type.ID,
				tipo: type.Nome,
			};
			const fromDate = formJson.fromDate;
			const toDate = formJson.toDate;
			const parsedFromDate = dayjs(fromDate, "DD/MM/YYYY");
      const parsedToDate = dayjs(toDate, "DD/MM/YYYY");
			const description = formJson.description;

			const newTimeoff = {
				...employeeData,
				...statusData,
				...typeData,
				dal: fromDate,
				al: toDate,
				dalDateTime: fromDate,
				alDateTime: toDate,
				giorni: parsedToDate.diff(parsedFromDate, "days"),
				motivazione: description,
				giornoIntero: isFullDay,
			}

			PUT(timeoffsEndpoint, newTimeoff);
			handleCloseNewTimeoffDialog();
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
				}
			}}
		>
			<Typography variant={"h2"} color={"primary"} fontWeight={800} textAlign={"center"} gutterBottom>
				AVVISI ASSENZE
			</Typography>

			{/* UPDATE TIMEOFF */}
			<Dialog
				open={openTimeoffDialog}
				onClose={handleCloseTimeoffDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle align='center'>Assenza selezionata</DialogTitle>
				<DialogContent>
					<TextField
						required
						margin="dense"
						id="statusId"
						name="statusId"
						label="Stato"
						select
						fullWidth
						variant="standard"
						defaultValue={selectedTimeoff?.idStato}
						onChange={event => updateSelectedTimeoffStatus(parseInt(event.target.value))}
					>
						{timeoffStatuses.map((status) =>
							<MenuItem key={status.ID} value={status.ID}>
								{status.Nome}
							</MenuItem>
						)}
					</TextField>
					<TextField
						required
						margin="dense"
						id="typeId"
						name="typeId"
						label="Tipo Notifica"
						select
						fullWidth
						variant="standard"
						defaultValue={selectedTimeoff?.ID_Tipo}
						onChange={event => updateSelectedTimeoffType(parseInt(event.target.value))}
					>
						{timeoffTypes.map((timeoffType) =>
							<MenuItem key={timeoffType.ID} value={timeoffType.ID}>
								{timeoffType.Nome}
							</MenuItem>
						)}
					</TextField><br/><br/>
					<Typography><b>Nome</b>: {selectedTimeoff?.nomeCognome}</Typography><br/>
					<Typography><b>Giorni</b>: {selectedTimeoff?.giornoIntero ?
							dayjs(selectedTimeoff?.dalDateTime).format("DD/MM/YYYY") + " - " + dayjs(selectedTimeoff?.alDateTime).format("DD/MM/YYYY")
							:
							dayjs(selectedTimeoff?.dalDateTime).format("DD/MM/YYYY hh:mm") + " - " + dayjs(selectedTimeoff?.alDateTime).format("DD/MM/YYYY hh:mm")
						}
					</Typography><br/>
					<Typography><b>Motivazione</b>:</Typography>
					<Typography sx={{ wordBreak: "break-word" }}>{selectedTimeoff?.motivazione || "--- Non inserita ---"}</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseTimeoffDialog} variant="outlined">Chiudi</Button>
				</DialogActions>
			</Dialog>

			{/* CREATE TIMEOFF */}
			<Button variant='outlined' onClick={handleOpenNewTimeoffDialog}>Crea nuova assenza</Button>
			<Dialog
				open={openNewTimeoffDialog}
				onClose={handleCloseNewTimeoffDialog}
				PaperProps={{
					component: 'form',
					onSubmit: sendNewTimeoff,
				}}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle align='center'>Nuova Assenza</DialogTitle>
				<DialogContent>
					<TextField
						required
						margin="dense"
						id="employeeId"
						name="employeeId"
						label="Nome"
						select
						fullWidth
						variant="standard"
						defaultValue=""
					>
						{employees.map((employee) =>
							<MenuItem key={employee.ID} value={employee.ID}>
								{employee.Nome} {employee.Cognome}
							</MenuItem>
						)}
					</TextField>
					<TextField
						required
						margin="dense"
						id="statusId"
						name="statusId"
						label="Stato"
						select
						fullWidth
						variant="standard"
						defaultValue={2}
					>
						{timeoffStatuses.map((status) =>
							<MenuItem key={status.ID} value={status.ID}>
								{status.Nome}
							</MenuItem>
						)}
					</TextField>
					<TextField
						required
						margin="dense"
						id="typeId"
						name="typeId"
						label="Tipo Notifica"
						select
						fullWidth
						variant="standard"
						defaultValue=""
					>
						{timeoffTypes.map((timeoffType) =>
							<MenuItem key={timeoffType.ID} value={timeoffType.ID}>
								{timeoffType.Nome}
							</MenuItem>
						)}
					</TextField>
					<FormControlLabel
						control={
							<Switch
								checked={isFullDay}
								onChange={handleChange}
							/>}
						label="Giorno intero"
						sx={{marginTop:1}}
					/>
					<Box display="flex" flexDirection="row" gap={1} marginTop={2}>
						{isFullDay ?
							<>
								<DatePicker
									name='fromDate'
									label="Dal giorno"
									defaultValue={dayjs()}
								/>
								<DatePicker
									name='toDate'
									label="Al giorno"
									defaultValue={dayjs()}
								/>
							</>
							:
							<>
								<DateTimePicker
									name='fromDate'
									label="Dal giorno e ora"
									defaultValue={dayjs()}
								/>
								<DateTimePicker
									name='toDate'
									label="Al giorno e ora"
									defaultValue={dayjs()}
								/>
							</>
						}
					</Box>
					<TextField
						margin="dense"
						id="description"
						name="description"
						label="Motivazione"
						type="text"
						fullWidth
						multiline
						rows={4}
						variant="outlined"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseNewTimeoffDialog} variant="outlined">Annulla</Button>
					<Button type="submit" variant="contained">invia</Button>
				</DialogActions>
			</Dialog>

			{/* NOTIFICATION TABLE */}
			<Box height={"500px"} width={"100%"}>
				{isLoading ?
					<Box display="flex" justifyContent="center" alignItems="center" height={"100%"}>
						<CircularProgress />
					</Box>
				:
					<DataGrid rows={rows} columns={columns}
						getRowHeight={() => 'auto'}
						getRowClassName={(params) => {
							return params.row.status;
						}}
						onRowClick={(params) => handleRowClick(params.row)}
						disableRowSelectionOnClick
						showCellVerticalBorder
					/>
				}
			</Box>
		</Box>
	);
}

