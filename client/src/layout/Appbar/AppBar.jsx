import React from "react";
import { DRAWER_WIDTH } from "../constant.js";
import { Menu, Toolbar, Typography, AppBar as MUAppBar } from "@mui/material";
import { Icon, IconButton, MenuItem } from "@components";
import { useDispatch } from "react-redux";
import { drawerToggle } from "../../features/layout/layoutSlice.js";

import { useLang } from "@hooks";
const AppBar = () => {
	const [anchorEl, setAnchorEl] = React.useState(null);

	const { t } = useLang();
	const dispatch = useDispatch();
	const handleDrawerToggle = () => {
		dispatch(drawerToggle());
	};
	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<MUAppBar
			position="fixed"
			sx={{
				width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
				marginInlineStart: { md: `${DRAWER_WIDTH}px` },
			}}
		>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{
						display: { md: "none" },
						marginInlineEnd: 2,
					}}
					name="Menu"
				/>

				<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
					{t("Page Title") || "Dashboard"}
				</Typography>

				<IconButton color="inherit" title="Switch Language" name="Language" />

				<IconButton color="inherit" name="Notifications" />

				<IconButton color="inherit" name="AccountCircle" onClick={handleMenuOpen} />
				<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
					<MenuItem onClick={handleMenuClose}>{t("Profile") || "Profile"}</MenuItem>
					<MenuItem onClick={handleMenuClose}>{t("My Account") || "My Account"}</MenuItem>
					<MenuItem onClick={handleMenuClose}>{t("Logout") || "Logout"}</MenuItem>
				</Menu>
			</Toolbar>
		</MUAppBar>
	);
};

export default AppBar;
