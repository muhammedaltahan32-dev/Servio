import { Icon, Switch } from "@components";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, useColorScheme } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../features/theme/themeSlice.js";

const ThemeSwitcher = () => {
	const { mode, setMode } = useColorScheme();
	const dispatch = useDispatch();
	const changeMode = () => {
		setMode(mode === "dark" ? "light" : "dark");
	};
	return (
		<ListItem disablePadding>
			<ListItemButton onClick={() => changeMode()}>
				<ListItemIcon>
					<Icon name="BedtimeOutlined" />
				</ListItemIcon>
				<ListItemText primary={"dark mode"} />
				<Switch checked={mode === "dark"} tabIndex={-1} />
			</ListItemButton>
		</ListItem>
	);
};

export default ThemeSwitcher;
