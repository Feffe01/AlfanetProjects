import React from "react";
import { ColorModeContext } from "../../constants/contexts.tsx";
import { Tooltip, useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";


function SwitchThemeButton() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

	return (
		<Tooltip title={theme.palette.mode === "dark" ? "Tema chiaro" : "Tema scuro"}>
			<IconButton onClick={colorMode.toggleColorMode} color="inherit">
				{theme.palette.mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
			</IconButton>
		</Tooltip>
	);
}

export default SwitchThemeButton;