import IconButton from "@mui/material/IconButton";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

interface LogoutButtonProps {
  edge?: "start" | "end";
	size?: "small" | "medium" | "large";
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ edge, size }) => {
	const navigate = useNavigate();
	
	const logout = () => {
		console.log("logout")
		localStorage.clear();
		navigate('/login');
	}

	return (
		<Tooltip title="Esci">
			<IconButton color="inherit" edge={edge} size={size} onClick={logout}>
				<LogoutRoundedIcon />
			</IconButton>
		</Tooltip>
	);
}

export default LogoutButton;