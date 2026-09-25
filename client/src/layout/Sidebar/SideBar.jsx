import { Icon } from "@components";
import { useLang } from "@hooks";
import { Avatar, Box, Divider, Drawer, List, Toolbar, Typography, useColorScheme, useTheme } from "@mui/material";
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

	const { user } = useSelector((state) => state.auth);
	const { mobileOpen } = useSelector((state) => state.layout);

	const { mode } = useColorScheme();
	const theme = useTheme();
	const { t } = useLang();

	const isDark = mode === "dark";

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
					color: "text.primary",
				}}
			>
				{/* ==============================
				    LOGO
				============================== */}
				<Toolbar
					disableGutters
					sx={{
						minHeight: {
							xs: 64,
							md: 88,
						},

						px: {
							xs: 2,
							md: 1,
						},

						justifyContent: {
							xs: "flex-start",
							md: "center",
						},
					}}
				>
					<Box
						sx={{
							width: {
								xs: 42,
								md: 52,
							},

							height: {
								xs: 42,
								md: 52,
							},

							borderRadius: 2,

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
						sx={{
							ml: 1.5,
							fontWeight: 700,

							display: {
								xs: "block",
								md: "none",
							},
						}}
					>
						Servio
					</Typography>
				</Toolbar>

				<Divider />

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
				<Divider />
				<List disablePadding>
					<ThemeSwitcher />
					<SidebarItem icon={<Avatar src="" />} label={user?.[User_Name]} showTitle={false} />
				</List>
			</Box>
		),
		[user],
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
						width: theme.layout["mobile.drawer-width"],

						border: "none",

						bgcolor: "background.paper",

						color: "text.primary",
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
						border: "none",
						bgcolor: "background.paper",
						boxShadow: "none",
						color: "text.primary",

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
