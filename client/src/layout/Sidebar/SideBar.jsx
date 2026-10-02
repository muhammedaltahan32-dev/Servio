import { Icon } from "@components";
import { Avatar, Box, Divider, Drawer, List, Toolbar, Typography, useTheme } from "@mui/material";
import { sidebarMenu } from "@router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { User_Name } from "../../../../constants/FieldsName.js";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import { closeDrawer, drawerToggle } from "../../features/layout/layoutSlice.js";
import SidebarItem from "./elements/SidebarItem.jsx";
import SidebarList from "./elements/SidebarList.jsx";

export const SideBar = () => {
	const dispatch = useDispatch();

	const user = useSelector((state) => state.auth?.user);
	const mobileOpen = useSelector((state) => state.layout.mobileOpen);

	const theme = useTheme();

	const handleDrawerToggle = () => {
		dispatch(drawerToggle());
	};

	const drawerContent = React.useMemo(
		() => (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					overflow: "hidden",
					bgcolor: "background.paper",
					// color: "#F2F6FC",
				}}
			>
				{/* ==============================
				    LOGO
				============================== */}
				<Toolbar
					disableGutters
					sx={{
						minHeight: {
							xs: theme.tokens.size.mobileAppBarHeight,
							md: theme.tokens.size.appBarHeight,
						},

						px: theme.tokens.space.pageXs,

						justifyContent: "flex-start",
					}}
				>
					<Box
						sx={{
							width: theme.tokens.size.logo,

							height: theme.tokens.size.logo,

							borderRadius: `${theme.tokens.radius.card}px`,

							display: "flex",
							alignItems: "center",
							justifyContent: "center",

							bgcolor: "primary.main",
							color: "primary.contrastText",
						}}
					>
						<Icon name="Storefront" />
					</Box>

					<Typography
						variant="h6"
						noWrap
						sx={{ ml: 1.5, fontWeight: 700, display: "block" }}
					>
						Servio
					</Typography>
				</Toolbar>

				<Divider sx={{ borderColor: theme.tokens.color.sidebarDivider }} />

				{/* ==============================
				    MAIN NAVIGATION
				============================== */}
				<Box
					sx={{
						flex: 1,
						overflowY: "auto",
						overflowX: "hidden",
						scrollbarWidth: "none",

						// px: {
						// 	xs: 1,
						// 	md: 1,
						// },

						py: 1,
					}}
				>
					<SidebarList />
				</Box>
				<Divider sx={{ borderColor: theme.tokens.color.sidebarDivider }} />
				<List disablePadding>
					<ThemeSwitcher />
					<SidebarItem icon={<Avatar src="" />} label={user?.[User_Name]} />
				</List>
			</Box>
		),
				[user, theme],
	);

	return (
		<Box
			component="nav"
			sx={(theme) => ({
				width: {
					md: theme.layout["desktop-drawer-width"],
				},

				flexShrink: {
					md: 0,
				},
			})}
		>
			<Drawer
				variant="temporary"
				anchor="left"
				open={mobileOpen}
				onClose={() => dispatch(closeDrawer())}
				ModalProps={{
					keepMounted: true,
				}}
				sx={(theme) => ({
					display: {
						xs: "block",
						md: "none",
					},

					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: theme.layout["mobile-drawer-width"],

						border: "none",

						// bgcolor: "#141D2E",

						// color: "#F2F6FC",
					},
				})}
			>
				{drawerContent}
			</Drawer>

			<Drawer
				variant="permanent"
				anchor="left"
				open
				sx={(theme) => ({
					display: {
						xs: "none",
						md: "block",
					},

					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: theme.layout["desktop-drawer-width"],
						border: 0,
						borderInlineEnd: "1px solid",
						borderColor: "rgba(226, 232, 241, 0.12)",
						// bgcolor: "#141D2E",
						boxShadow: "none",
						// color: "#F2F6FC",

						overflowX: "hidden",
					},
				})}
			>
				{drawerContent}
			</Drawer>
		</Box>
	);
};

export default SideBar;
