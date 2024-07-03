import { Visibility, VisibilityOff } from '@mui/icons-material'
import Box from '@mui/material/Box'
import axios from 'axios'
import React, { useState } from 'react'
import { loginEndpoint, mainHost } from '../commons/endpoints'
import { Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
	const [showUsernameError, setShowUsernameError] = useState(false);
	const [showPasswordError, setShowPasswordError] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

	const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const username = (form.elements.namedItem('username') as HTMLInputElement).value;
		const passwordX = (form.elements.namedItem('password') as HTMLInputElement).value;
		axios.post(mainHost + loginEndpoint, {
			username,
			passwordX,
			tipo: "cf"
		})
		.then((r) => {
			console.log("Login POST response: ", r)
		})
		.catch((err) => {
			console.log("Error: ", err)
		})
	}

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
			width='100vw'
			height='100vh'
		>
			<Box
				width='80%'
				display='flex'
				flexDirection='row'
			>
				<Box
					width='50%'
					display='flex'
					flexDirection='column'
					alignItems='center'
					justifyContent='center'
				>
					<img
						src='src/assets/pegasusLogo.png'
						alt='Pegasus Logo'
						style={{
							width: '400px'
						}}
					/>
				</Box>
				<Box
					width='50%'
					display='flex'
					flexDirection='column'
					alignItems='center'
					justifyContent='center'
				>
					<Typography
						variant='h2'
						color='primary'
						fontWeight='700'
					>
						PEGASUS
					</Typography>
					<Typography
						variant='h4'
						color='secondary'
						gutterBottom
					>
						Area Responsabili
					</Typography>
					<Box
						component='form'
						onSubmit={handleLogin}
						width='60%'
						display='flex'
						flexDirection='column'
						gap='10px'
						pt='10px'
						pb='10px'
					>
						<TextField
							name='username'
							label='Codice Fiscale'
							variant='outlined'
							error={showUsernameError}
							helperText={showUsernameError ? "Codice Fiscale sbagliato" : null}
							fullWidth
							required
						/>
						<FormControl variant='outlined'  error={showPasswordError} required>
							<InputLabel htmlFor='passwordInput'>Password</InputLabel>
							<OutlinedInput
								id="passwordInput"
								name='password'
								type={showPassword ? 'text' : 'password'}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
											color={showPasswordError ? 'error' : 'default'}
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								label="Password"
								fullWidth
							/>
							{showPasswordError ? <FormHelperText error>Password errata</FormHelperText> : null}
							</FormControl>
						<Button
							type='submit'
							fullWidth
						>
							Accedi
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}
