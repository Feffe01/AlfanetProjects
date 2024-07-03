import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './index.css';
import Login from './pages/Login.tsx';
import Homepage from './pages/Homepage.tsx';
import { CssBaseline, PaletteMode } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ColorModeContext } from './commons/contexts.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: 'homepage/',
				element: <Homepage />,
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
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<RouterProvider router={router} />
			</ThemeProvider>
		</ColorModeContext.Provider>
	)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
)
