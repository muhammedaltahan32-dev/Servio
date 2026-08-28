import { Icon, Switch } from "@components";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, useColorScheme } from "@mui/material";
import React from "react";
import SidebarItem from "./elements/SidebarItem.jsx";
import { useLang } from "@hooks";

const ThemeSwitcher = () => {
	const { colorScheme, setMode } = useColorScheme();
	const { t } = useLang();

	const changeMode = () => {
		setMode(colorScheme === "dark" ? "light" : "dark");
	};
	return (
		<SidebarItem
			label={t(`layout.mode.${colorScheme === "dark" ? "light" : "dark"}`)}
			icon={colorScheme === "dark" ? "LightMode" : "DarkMode"}
			onClick={changeMode}
		>
			<Switch checked={colorScheme === "dark"} tabIndex={-1} sx={{ pointerEvents: "none" }} />
		</SidebarItem>
	);
};

export default ThemeSwitcher;
