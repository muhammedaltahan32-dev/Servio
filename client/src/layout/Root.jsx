import React, { useState } from "react";
import AppBar from "./Appbar/AppBar.jsx";
import {
	Box,
	CssBaseline,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	Menu,
	MenuItem,

} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AnalyticsIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";

import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../features/lang/langSlice.js";
import { useTranslation } from "react-i18next";
import { useLang } from "@hooks";
import { DRAWER_WIDTH } from "./constant.js";
import SideBar from "./Sidebar/SideBar.jsx";
import Main from "./Main/Main.jsx";

export default function Root() {
	




	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const { currentLanguage, changeLanguage } = useLang();



	const handleToggleLanguage = () => {
		const nextLang = currentLanguage === "ar" ? "en" : "ar";
		changeLanguage(nextLang);
	};

	return (
		<Box sx={{ display: "flex", overflow: "auto" }}>
			<CssBaseline />
			<AppBar />
			<SideBar />
			<Main />
		</Box>
	);
}
