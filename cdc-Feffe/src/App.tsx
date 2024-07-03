import { useEffect, useState } from 'react'
import Layout from './components/Layout';
import Box from '@mui/material/Box';
import './App.css';
import { Navigate, useNavigate } from 'react-router-dom';

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const navigateTo = useNavigate();
	console.log("App rendered")

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
			{loggedIn ? <Navigate to={'homepage'} /> : <Navigate to={'/login'} />}
			<Layout />
    </Box>
  )
}

export default App
