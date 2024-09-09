import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { notificationsEndpoint, notificationTypesEndpoint } from '../constants/endpoints';
import { GET } from '../constants/httpRequests';
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
	lettoUser: boolean,
}

export default function NotificationsPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [notifications, setNotification] = useState<Notification[]>([]);
	const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([]);

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
			field: 'content', headerName: 'Notifica', minWidth: 100, flex: 5,
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
			setNotification(data.Notifiche)
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
			const row: { [key: string]: any } = {
				id: notification.ID,
				recipient: notification.id_destinatario,
				type: notification.idTipo,
				content: notification.descrizione,
				date:	dayjs(notification.data).format("DD/MM/YYYY"),
				time:	dayjs(notification.ora, "HH:mm:ss").format("HH:mm"),
			};

			return row;
		});

		return transformedRows;
	};

	const rows: GridRowsProp = transformDataForTable();

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
			}}
		>
			<Typography variant={"h2"} color={"primary"} fontWeight={800} textAlign={"center"} gutterBottom>
				CENTRO NOTIFICHE
			</Typography>
			<Box height={"500px"} width={"100%"}>
				{isLoading ?
					<Box display="flex" justifyContent="center" alignItems="center" height={"100%"}>
						<CircularProgress />
					</Box>
				:
					<DataGrid rows={rows} columns={columns}
						getRowHeight={() => 'auto'}
						showCellVerticalBorder
					/>
				}
			</Box>
		</Box>
	);
}

