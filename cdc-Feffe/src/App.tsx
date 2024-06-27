import { useEffect, useState } from 'react'
import Layout from './components/Layout';
import Box from '@mui/material/Box';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Login from './pages/Login';
import { useNavigate } from 'react-router-dom';

export async function loader() {
  
}

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#141850',
    },
    secondary: {
      main: '#ED7966',
    },
  },
  typography: {
    fontFamily: 'Assistant, Helvetica, Arial, sans-serif'
  }
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00a6d1',
    },
    secondary: {
      main: '#ED7966',
    },
  },
  typography: {
    fontFamily: 'Assistant, Helvetica, Arial, sans-serif'
  }
})

function App() {
  const [isLightModeActive, setIsLightModeActive] = useState<boolean>(true);
	const [loggedIn, setLoggedIn] = useState(false);
	const navigateTo = useNavigate();

	const checkLogin = () => {
		const token = localStorage.getItem('token');

		if (token)
		{
			setLoggedIn(true);
			navigateTo('/homepage');
		}
	}

	useEffect(() => {
		checkLogin();
	}, [])

  return (
    <Box>
			<CssBaseline />
      <ThemeProvider theme={isLightModeActive ? lightTheme : darkTheme}>
				{loggedIn ? <Layout /> : <Login />}
      </ThemeProvider>
    </Box>
  )
}

export default App
