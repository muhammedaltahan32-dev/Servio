import { Icon, Switch } from "@components";
import { useLang } from "@hooks";
import {
	Avatar,
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	useTheme,
} from "@mui/material";
import { sidebarMenu } from "@router";
import React from "react";
import { useNavigate } from "react-router";
import { DRAWER_WIDTH } from "../constant.js";
import { useDispatch, useSelector } from "react-redux";
import { User_Name } from "../../../../constants/FieldsName.js";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import { closeDrawer, drawerToggle } from "../../features/layout/layoutSlice.js";

export const SideBar = () => {
	const { mobileOpen } = useSelector((state) => state.layout);
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const { t } = useLang();
	const goto = useNavigate();

	const handleDrawerToggle = () => {
		dispatch(drawerToggle());
	};

	const theme = useTheme();
	const drawerContent = (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: "0px" }}>
			<Toolbar>
				<Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
					Servio
				</Typography>
			</Toolbar>
			<Divider />
			<List disablePadding sx={{ padding: "0.8rem", flexGrow: "1" }}>
				{sidebarMenu.map((item) => (
					<ListItem key={item.label} disablePadding>
						<ListItemButton
							onClick={() => {
								goto(item.path);
								if (mobileOpen) dispatch(closeDrawer());
							}}
						>
							<ListItemIcon>
								<Icon name={item.icon} />
							</ListItemIcon>
							<ListItemText primary={item.label} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<List disablePadding sx={{ padding: "0.8rem" }}>
				<ThemeSwitcher />
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon
							sx={{
								minWidth: 0,
								justifyContent: "center",
								transform: `translateX(-12%)`,
							}}
						>
							<Avatar src="" />
						</ListItemIcon>
						<ListItemText primary="admin" />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);
	return (
		<Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
			<Drawer
				variant="temporary"
				anchor={"left"}
				open={mobileOpen}
				onClose={() => dispatch(closeDrawer())}
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
				anchor={"left"}
				sx={{
					display: { xs: "none", md: "block" },
					"& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
				}}
				open
			>
				{drawerContent}
			</Drawer>
		</Box>
	);
};

export default SideBar;
