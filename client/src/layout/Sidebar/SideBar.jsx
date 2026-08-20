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
import SidebarItem from "./elements/SidebarItem.jsx";

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
		<Box
			sx={(theme) => ({
				display: "flex",
				flexDirection: "column",
				height: "100%",
				p: "0px",
				backgroundColor: theme.vars.palette.grey[50],
				...theme.applyStyles("dark", {
					backgroundColor: theme.vars.palette.grey["900"],
				}),
			})}
		>
			<Toolbar>
				<Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
					Servio
				</Typography>
			</Toolbar>
			<Divider />
			<List disablePadding sx={{ padding: "0.8rem", flexGrow: "1" }}>
				{sidebarMenu.map((item) => (
					<SidebarItem
						key={item.label}
						icon={item.icon}
						label={item.label}
						onClick={() => {
							goto(item.path);
							if (mobileOpen) dispatch(closeDrawer());
						}}
					></SidebarItem>
				))}
			</List>
			<List disablePadding sx={{ padding: "0.8rem" }}>
				<ThemeSwitcher />
				<SidebarItem
					icon={<Avatar src="" sx={{ transform: "translateX(-25%)" }} />}
					label={user[User_Name]}
				></SidebarItem>
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
