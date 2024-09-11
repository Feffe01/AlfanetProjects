import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { anagraficaEndpoint, notificationsEndpoint, notificationTypesEndpoint } from '../constants/endpoints';
import { GET, POST, PUT } from '../constants/httpRequests';
import dayjs from 'dayjs';

interface NotificationType {
	ID: number,
	Tipo: string,
}

interface Notification {
	ID: number,
	data: string,
	ora: string,
	descrizione: string,
	idTipo: string,
	id_destinatario: string,
	lettoAdmin: boolean,
}

interface TableRow {
	id: number,
	date: string,
	time: string,
	message: string,
	type: string,
	recipient: string,
	isRead: boolean,
}

interface Employee {
	ID: number,
	Nome: string,
	Cognome: string,
}

export default function NotificationsPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([]);
	const [openNewNotificationDialog, setOpenNewNotificationDialog] = useState(false);

	const columns: GridColDef[] = [
		{
			field: 'recipient', headerName: 'Destinatario', width: 150, minWidth: 100, maxWidth: 300,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'type', headerName: 'Tipologia', width: 150, minWidth: 100, maxWidth: 150,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'message', headerName: 'Notifica', minWidth: 100, flex: 5,
			headerAlign: "center", headerClassName: "header",
		},
		{
			field: 'time', headerName: 'Ora', width: 60, minWidth: 60, maxWidth: 60,
			headerAlign: "center", headerClassName: "header",
			cellClassName: "timeCells",
		},
		{
			field: 'date', headerName: 'Data', width: 100, minWidth: 100, maxWidth: 100,
			headerAlign: "center", headerClassName: "header",
			cellClassName: "dateCells",
		},
	];

	// GETTING AND SETTING NOTIFICATION TYPES
	const getNotificationTypes = async () => {
		try {
			const data = await GET(notificationTypesEndpoint);
			setNotificationTypes(data.TipoNotifiche);
		} catch {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		}
	}

	useEffect(() => {
		getNotificationTypes();
	}, []);

	// GETTING AND SETTING NOTIFICATION
	const getNotifications = async () => {
		try {
			// setIsLoading(true);
			const data = await GET(notificationsEndpoint);
			setNotifications(data.Notifiche);
		} catch {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getNotifications();
	}, []);

	const transformDataForTable = () => {
		if (!notifications.length) return [];

		const transformedRows = notifications.map((notification) => {
			const row: TableRow = {
				id: notification.ID,
				recipient: notification.id_destinatario,
				type: notification.idTipo,
				message: notification.descrizione,
				date:	dayjs(notification.data).format("DD/MM/YYYY"),
				time:	dayjs(notification.ora, "HH:mm:ss").format("HH:mm"),
				isRead: notification.lettoAdmin,
			};

			return row;
		});

		return transformedRows;
	};

	const rows: GridRowsProp = transformDataForTable();

	//ON ROW CLICK
	const handleRowClick = (row: TableRow) => {
		if (row.isRead)
			return;
		PUT(notificationsEndpoint, {id: row.id});
		setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.ID === row.id
          ? { ...notification, lettoAdmin: true }
          : notification
      )
    );
	}

	//NEW NOTIFICATION'S DIALOG
	const [employees, setEmployees] = useState<Array<Employee>>([]);

	const handleOpenNewNotificationDialog = () => setOpenNewNotificationDialog(true);
	const handleCloseNewNotificationDialog = () => setOpenNewNotificationDialog(false);

	const getEmployees = async () => {
		GET (anagraficaEndpoint, null, setEmployees)
	}

	useEffect(() => {
		getEmployees();
	}, []);

	const sendNewNotification = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries((formData as any).entries());
		const recipientId = parseInt(formJson.recipientId);
		const typeId = parseInt(formJson.typeId);
		const message = formJson.message;

		try {
			await POST(notificationsEndpoint, [{
				idDipendente: recipientId,
				idTipoNotifica: typeId,
				messaggio: message,
				data: dayjs().toISOString(),
			}])
		} finally {
			getNotifications();
			handleCloseNewNotificationDialog();
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
				'& .timeCells': {
					textAlign: "center",
				},
				'& .dateCells': {
					textAlign: "center",
				},
				'& .notification-read': {
					backgroundColor: theme.palette.mode == "dark" ? theme.palette.grey[900] : theme.palette.grey[200],
				},
				'& .MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
					outline: "none !important",
				}
			}}
		>
			<Typography variant={"h2"} color={"primary"} fontWeight={800} textAlign={"center"} gutterBottom>
				CENTRO NOTIFICHE
			</Typography>

			{/* CREATE NOTIFICATION */}
			<Button variant='outlined' onClick={handleOpenNewNotificationDialog}>Crea nuova notifica</Button>
			<Dialog
				open={openNewNotificationDialog}
				onClose={handleCloseNewNotificationDialog}
				PaperProps={{
					component: 'form',
					onSubmit: sendNewNotification,
				}}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle align='center'>Nuova Notifica</DialogTitle>
				<DialogContent>
					<TextField
						required
						margin="dense"
						id="recipientId"
						name="recipientId"
						label="Destinatario"
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
						id="typeId"
						name="typeId"
						label="Tipo Notifica"
						select
						fullWidth
						variant="standard"
						defaultValue=""
					>
						{notificationTypes.map((notificationType) =>
							<MenuItem key={notificationType.ID} value={notificationType.ID}>
								{notificationType.Tipo}
							</MenuItem>
						)}
					</TextField>
					<TextField
						required
						margin="dense"
						id="message"
						name="message"
						label="Messaggio"
						type="text"
						fullWidth
						multiline
						rows={4}
						variant="outlined"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseNewNotificationDialog} variant="outlined">Annulla</Button>
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
							if (params.row.isRead)
								return 'notification-read';
							return 'notification-not-read';
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

