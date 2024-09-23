import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx';
import './index.css';
import { CssBaseline, PaletteMode } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeContext } from './constants/contexts.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/it';
// Localization imports for Italian language
import { itIT as dataGridItIT } from '@mui/x-data-grid/locales';
import { itIT as coreItIT } from '@mui/material/locale';
import { itIT } from '@mui/x-date-pickers/locales';
// Page components
import Login from './pages/Login.tsx';
import ShiftsPage from './pages/ShiftsPage.tsx';
import StampingsPage from './pages/StampingsPage.tsx';
import TimeoffsPage from './pages/TimeoffsPage.tsx';
import NotificationsPage from './pages/NotificationsPage.tsx';
import PaySlipsPage from './pages/PaySlipsPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import GraphPage from './pages/GraphPage.tsx';

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
				path: 'turni/',
				element: <ShiftsPage />,
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
			/*{
				path: 'bustepaga/',
				element: <PaySlipsPage />,
			},*/
			{
				path: 'profilo/',
				element: <ProfilePage />,
			},
			{
				path: 'grafico/',
				element: <GraphPage />,
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
					main: '#141850',	//dark blue
				},
				secondary: {
					main: '#ED7966',	//orange
				},
			} : {
				primary: {
					main: '#ED7966',	//orange	//#00a6d1 for light blue
				},
				secondary: {
					main: '#ED7966',	//orange
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

	const theme = React.useMemo(() => createTheme(
		getPalette(mode),
		itIT,
		dataGridItIT,
		coreItIT,
	), [mode]);

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
