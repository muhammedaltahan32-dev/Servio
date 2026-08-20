import React from "react";
import { DRAWER_WIDTH } from "../constant.js";
import { Toolbar, Typography, AppBar as MUAppBar } from "@mui/material";
import { Icon, IconButton, MenuItem, Menu } from "@components";
import { useDispatch } from "react-redux";
import { drawerToggle } from "../../features/layout/layoutSlice.js";

import { useLang } from "@hooks";
const AppBar = () => {
	const { t, i18n } = useLang();
	const dispatch = useDispatch();
	const handleDrawerToggle = () => {
		dispatch(drawerToggle());
	};
	return (
		<MUAppBar
			color="transparent"
			position="fixed"
			sx={{
				boxShadow: "none",
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

				<Menu>
					<Menu.Trigger>
						<IconButton color="inherit" title="Switch Language" name="Language" />
					</Menu.Trigger>
					<Menu.Content>
						{i18n.languages.map((lang) => (
							<Menu.Item key={lang}>{t(`layout.languages.${lang}`)}</Menu.Item>
						))}
					</Menu.Content>
				</Menu>
				<IconButton color="inherit" name="Notifications" />

				<Menu>
					<Menu.Trigger>
						<IconButton color="inherit" name="AccountCircle" />
					</Menu.Trigger>
					<Menu.Content>
						<Menu.Item>{t("Profile") || "Profile"}</Menu.Item>
						<Menu.Item>{t("My Account") || "My Account"}</Menu.Item>
						<Menu.Item>{t("Logout") || "Logout"}</Menu.Item>
					</Menu.Content>
				</Menu>
			</Toolbar>
		</MUAppBar>
	);
};

export default AppBar;
