import { Icon, Switch } from "@components";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, useColorScheme } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../features/theme/themeSlice.js";
import SidebarItem from "./elements/SidebarItem.jsx";
import { useLang } from "@hooks";

const ThemeSwitcher = () => {
	const { mode, setMode } = useColorScheme();
	const { t } = useLang();
	const dispatch = useDispatch();
	const changeMode = () => {
		setMode(mode === "dark" ? "light" : "dark");
	};
	return (
<SidebarItem
  label={t(`layout.mode.${mode === "dark" ? "light" : "dark"}`)}
  icon={mode === "dark" ? "LightMode" : "DarkMode"}
  onClick={changeMode}
>
  <Switch checked={mode === "dark"} tabIndex={-1} sx={{ pointerEvents: "none" }} />
</SidebarItem>
	);
};

export default ThemeSwitcher;
