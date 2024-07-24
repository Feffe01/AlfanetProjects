import { Avatar, Button, CircularProgress, Collapse, FormControl, FormHelperText, Input, InputLabel, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { GET, PUT } from "../costants/httpRequests";
import { changePasswordEndpoint, profileEndpoint } from "../costants/endpoints";
import { IMaskInput } from "react-imask";
import { useNavigate } from "react-router-dom";

interface PhoneNumberInputProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="+00 000 000 0000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

export default function ProfilePage() {
	const [isLoading, setIsLoading] = useState(true);
	const [userInfo, setUserInfo] = useState<{ [key: string]: any }>({});
	const [initialInfo, setInitialInfo] = useState<{ [key: string]: any }>({});
	const [showEditAccount, setShowEditAccount] = useState(false);
	const [showEditPassword, setShowEditPassword] = useState(false);
	const [passwordChange, setPasswordChange] = useState({
		oldPassword: "",
		newPassword: "",
		retypeNewPassword: ""
	});
	const resetPasswordChange = () => setPasswordChange({
		oldPassword: "",
		newPassword: "",
		retypeNewPassword: ""
	})


	// GETTING AND SETTING USERINFO AND INITIAL INFO
	useEffect(() => {
		getUserInfo();
	}, []);

	const getUserInfo = async () => {
		try {
			const data = await GET(profileEndpoint);
			setInitialInfo(data);
			setUserInfo(data);
			setIsLoading(false);
		} catch {
			setIsLoading(false);
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		}
	};


	// HANDLING USER INFO CHANGE AND SUBMISSION
	const [emailError, setEmailError] = useState(false);
	const [phoneNumberError, setPhoneNumberError] = useState(false);
	const [disableAccountSubmitButton, setDisableAccountSubmitButton] = useState(true);

	const changeUserInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;
    setUserInfo({ ...userInfo, [key]: e.target.value });
  };

	useEffect(() => {
		if(JSON.stringify(userInfo) === JSON.stringify(initialInfo))
			setDisableAccountSubmitButton(true);
		else
			setDisableAccountSubmitButton(false);
	}, [userInfo]);
	
	const checkEmail = (email: string) =>
	{
		const emailRegex = /^[a-zA-Z\d!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	}

	const checkPhoneNumber = (phoneNumber: string) =>
	{
		if (phoneNumber.length < 16 && phoneNumber.length > 0)
			return false
		return true
	}

	const handleAccountSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let isValid: boolean = true;

		if (!userInfo.EmailPrincipale || checkEmail(userInfo.EmailPrincipale))
			setEmailError(false);
		else
		{
			setEmailError(true);
			isValid = false;
		}

		if(!userInfo.TelefonoPrincipale || checkPhoneNumber(userInfo.TelefonoPrincipale))
			setPhoneNumberError(false);
		else
		{
			setPhoneNumberError(true);
			isValid = false;
		}

		if(!isValid)
			return;

		updateUser();
	};

	const updateUser = async () => {
		try {
			const response = await PUT(profileEndpoint, userInfo);

			if(response.response === "ok")
			{
				setShowEditAccount(false);
				getUserInfo();
			}
			else
				console.error(response.response, response.details)
		} catch (error) {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.")
		}
	}


	//HANDLING PASSWORD CHANGE AND SUBMISSION
	const [passwordError, setPasswordError] = useState(false);
	const [newPasswordError, setNewPasswordError] = useState(false);
	const [repeatPasswordError, setRepeatPasswordError] = useState(false);

	const checkPassword = (password: string) =>
		{
			const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!#$%&'*+-/=?^_`{|}~])[A-Za-z\d!#$%&'*+-/=?^_`{|}~]{8,}$/
			return passwordRegex.test(password);
		}

	const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let isValid: boolean = true;

		if(passwordChange.newPassword !== passwordChange.oldPassword && checkPassword(passwordChange.newPassword))
			setNewPasswordError(false)
		else
		{
			setNewPasswordError(true)
			isValid = false;
		}

		if (passwordChange.retypeNewPassword !== passwordChange.newPassword)
		{
			setRepeatPasswordError(true);
			isValid = false;
		}
		else
			setRepeatPasswordError(false);

		if(!isValid)
			return;

		updatePassword();
	};

	const updatePassword = async () => {
		try {
			const response = await PUT(changePasswordEndpoint, passwordChange);

			if(response.response === "ok")
			{
				resetPasswordChange();
				setShowEditPassword(false);
				setPasswordError(false);
			}
			else if (response.response === "old password is wrong")
				setPasswordError(true)
			else
				console.error(response.response, response.details)
		} catch (error) {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.")
		}
	}


	// LOGOUT
	const navigate = useNavigate();
	
	const logout = () => {
		console.log("logout")
		localStorage.clear();
		navigate('/login');
	}

	
	// PAGE
	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			padding={2}
		>
			<Box
				display="flex"
				alignItems="center"
				mb="60px"
			>
				<Avatar alt="Remy Sharp" src={`data:image/png;base64,${userInfo.Foto || ""}`} sx={{ height: "120px", width: "120px", mr: "30px" }} />
				<Box
					display="flex"
					flexDirection="column"
					maxWidth="500px"
				>
					<Typography variant="h3">{userInfo.Nome}</Typography>
					<Typography variant="h3">{userInfo.Cognome}</Typography>
				</Box>
			</Box>

			<Box
				display="flex"
				alignItems="center"
				gap="20px"
				mb="20px"
			>
				<Button
					variant="contained"
					sx={{ bgcolor: !showEditAccount ? "primary.light" : "primary" }}
					onClick={() => {
						setShowEditPassword(false);
						setShowEditAccount(!showEditAccount);
					}}
				>
					Modifica dati
				</Button>

				<Button
					variant="contained"
					sx={{ bgcolor: !showEditPassword ? "primary.light" : "primary" }}
					onClick={() => {
						setShowEditAccount(false);
						setShowEditPassword(!showEditPassword);
					}}
				>
					Modifica password
				</Button>

				<Button
					variant="contained"
					color="error"
					onClick={logout}
				>
					Esci
				</Button>
			</Box>

			<Collapse in={showEditAccount}>
				<Box
					component="form"
					display="flex"
					flexDirection="column"
					gap="10px"
					width="200px"
					onSubmit={handleAccountSubmit}
				>
					<TextField
						label="Codice Fiscale"
						variant="standard"
						value={userInfo.CF}
						disabled
					/>

					<TextField
						label="Email"
						name="EmailPrincipale"
						variant="standard"
						type="text"
						value={userInfo.EmailPrincipale}
						onChange={changeUserInfo}
						error = {emailError}
						helperText={emailError ? 'Email non valida' : null}
					/>

					<FormControl variant="standard" error = {phoneNumberError}>
						<InputLabel htmlFor="formatted-text-mask-input">Telefono</InputLabel>
						<Input
							name="TelefonoPrincipale"
							value={userInfo.TelefonoPrincipale}
							onChange={changeUserInfo}
							id="formatted-text-mask-input"
							inputComponent={TextMaskCustom as any}
						/>
						<FormHelperText>{phoneNumberError ? 'Telefono non valido' : null}</FormHelperText>
					</FormControl>

					<Button type="submit" variant="contained" disabled={disableAccountSubmitButton}>
						Aggiorna dati
					</Button>
				</Box>
			</Collapse>
			
			<Collapse in={showEditPassword}>
				<Box
					component="form"
					display="flex"
					flexDirection="column"
					gap="10px"
					width="200px"
					onSubmit={handlePasswordSubmit}
				>
					<TextField
						label="Vecchia password"
						name="oldPassword"
						variant="standard"
						type="password"
						value={passwordChange.oldPassword}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setPasswordChange({ ...passwordChange, oldPassword: event.target.value });
						}}
						error = {passwordError}
						helperText={passwordError ? 'Password sbagliata' : null}
					/>
					<TextField
						label="Nuova password"
						name="newPassword"
						variant="standard"
						type="password"
						value={passwordChange.newPassword}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setPasswordChange({ ...passwordChange, newPassword: event.target.value });
						}}
						error = {newPasswordError}
						helperText={newPasswordError ? 'Almeno 8 caratteri tra cui almeno un numero, una maiuscola, una minuscola e uno speciale. Deve essere diverso dalla vecchia password.' : null}
					/>
					<TextField
						label="Ripeti nuova password"
						name="repeatPassword"
						variant="standard"
						type="password"
						value={passwordChange.retypeNewPassword}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setPasswordChange({ ...passwordChange, retypeNewPassword: event.target.value });
						}}
						error = {repeatPasswordError}
						helperText={repeatPasswordError ? 'Le password non corrispondono' : null}
					/>
					<Button
						type="submit"
						variant="contained"
						disabled={
							passwordChange.oldPassword == "" ||
							passwordChange.newPassword == "" ||
							passwordChange.retypeNewPassword == ""
						}
					>
						Aggiorna password
					</Button>
				</Box>
			</Collapse>
		</Box>
	);
}
