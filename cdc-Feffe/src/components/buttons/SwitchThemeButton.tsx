import React from "react";
import { ColorModeContext } from "../../costants/contexts.tsx";
import { useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";


function SwitchThemeButton() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

	return (
		<IconButton onClick={colorMode.toggleColorMode} color="inherit">
			{theme.palette.mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
		</IconButton>);
}

export default SwitchThemeButton;