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
	useTheme,
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

export default function Root() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const theme = useTheme();
	const isRtl = theme.direction === "rtl";
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const { currentLanguage, changeLanguage } = useLang();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleToggleLanguage = () => {
		const nextLang = currentLanguage === "ar" ? "en" : "ar";
		changeLanguage(nextLang);
	};

	const menuItems = [
		{ text: t("Dashboard") || "Dashboard", icon: <DashboardIcon />, path: "/orders" },
		{ text: t("Analytics") || "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
		{ text: t("Users") || "Users", icon: <PeopleIcon />, path: "/users" },
		{ text: t("Settings") || "Settings", icon: <SettingsIcon />, path: "/settings" },
	];

	const drawerContent = (
		<Box>
			<Toolbar>
				<Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
					{t("My App") || "Restaurant App"}
				</Typography>
			</Toolbar>
			<Divider />
			<List>
				{menuItems.map((item) => (
					<ListItem key={item.text} disablePadding>
						<ListItemButton
							onClick={() => {
								navigate(item.path);
								if (mobileOpen) setMobileOpen(false);
							}}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar />

			<Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
				<Drawer
					variant="temporary"
					anchor={isRtl ? "right" : "left"}
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{
						display: { xs: "block", md: "none" },
						"& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
					}}
				>
					{drawerContent}
				</Drawer>

				<Drawer
					variant="permanent"
					anchor={isRtl ? "right" : "left"}
					sx={{
						display: { xs: "none", md: "block" },
						"& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
					}}
					open
				>
					{drawerContent}
				</Drawer>
			</Box>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
					height: "100vh",
					backgroundColor: (theme) => theme.palette.grey[100],
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: "auto", maxHeight: "calc(100vh - 64px)", p: 3 }}>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
