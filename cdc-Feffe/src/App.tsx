import { useEffect } from 'react'
import Layout from './components/Layout';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

function App() {
	const navigate = useNavigate();

	useEffect(() => {
		const checkLogin = () => {
			const token = localStorage.getItem('token');
	
			if (!token)
				navigate('/login');
		}

		checkLogin();
	}, [navigate])

  return (
    <Box>
			<Layout />
    </Box>
  )
}

export default App
