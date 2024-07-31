import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './index.css';
import Login from './pages/Login.tsx';
import Homepage from './pages/Homepage.tsx';
import { CssBaseline, PaletteMode } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ColorModeContext } from './costants/contexts.tsx';
import StampingsPage from './pages/StampingsPage.tsx';
import TimeoffsPage from './pages/TimeoffsPage.tsx';
import NotificationsPage from './pages/NotificationsPage.tsx';
import PaySlipsPage from './pages/PaySlipsPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import ChangePasswordPage from './pages/ChangePasswordPage.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/it';

dayjs.extend(updateLocale)
dayjs.updateLocale('it', {
    weekStart: 1,
})

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: 'homepage/',
				element: <Homepage />,
			},
			{
				path: 'timbrature/',
				element: <StampingsPage />,
			},
			{
				path: 'assenze/',
				element: <TimeoffsPage />,
			},
			{
				path: 'notifiche/',
				element: <NotificationsPage />,
			},
			{
				path: 'bustepaga/',
				element: <PaySlipsPage />,
			},
			{
				path: 'profilo/',
				element: <ProfilePage />,
			},
			{
				path: 'cambio-password/',
				element: <ChangePasswordPage />,
			},
		]
	},
	{
		path: '/login',
		element: <Login />,
	},
])

const getPalette = (mode: PaletteMode) => ({
	palette: {
		mode,
		...(mode === 'light'
			? {
				primary: {
					main: '#141850',
				},
				secondary: {
					main: '#ED7966',
				},
			} : {
				primary: {
					main: '#00a6d1',
				},
				secondary: {
					main: '#ED7966',
				},
			}
		),
		typography: {
			fontFamily: 'Assistant, Helvetica, Arial, sans-serif'
		},
	}
})

const RootComponent = () => {
	const [mode, setMode] = React.useState<PaletteMode>('light');
	const colorMode = React.useMemo(() => ({
		toggleColorMode: () => {
			setMode((prevMode: PaletteMode) =>
				prevMode === 'light' ? 'dark' : 'light',
			);
		},
	}), []);

	const theme = React.useMemo(() => createTheme(getPalette(mode)), [mode]);

	return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<RouterProvider router={router} />
				</ThemeProvider>
			</ColorModeContext.Provider>
		</LocalizationProvider>
	)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
)
