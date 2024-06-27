import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import React from 'react'

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
						width='70%'
						display='flex'
						flexDirection='column'
						gap='10px'
						pt='10px'
						pb='10px'
					>
						<TextField
							id='cf'
							label='Codice Fiscale'
							variant='outlined'
							fullWidth
						/>
						<FormControl id='password' variant='outlined'>
							<InputLabel htmlFor='passwordInput'>Password</InputLabel>
							<OutlinedInput
								id="passwordInput"
								type={showPassword ? 'text' : 'password'}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								label="Password"
								fullWidth
							/>
						</FormControl>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}
