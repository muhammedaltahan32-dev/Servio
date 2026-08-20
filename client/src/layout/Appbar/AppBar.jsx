import React from "react";
import { DRAWER_WIDTH } from "../constant.js";
import { Toolbar, Typography, AppBar as MUAppBar, Tooltip } from "@mui/material";
import { Icon, IconButton, MenuItem, Menu } from "@components";
import { useDispatch } from "react-redux";
import { drawerToggle } from "../../features/layout/layoutSlice.js";

import { useLang } from "@hooks";
const AppBar = () => {
	const { t, supportedLanguages, changeLanguage } = useLang();
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
						<Tooltip title={t("layout.languages.language")}>
							<IconButton color="inherit" name="Language" />
						</Tooltip>
					</Menu.Trigger>
					<Menu.Content>
						{supportedLanguages.map((lang) => (
							<Menu.Item key={lang} onClick={() => changeLanguage(lang)}>
								{t(`layout.languages.${lang}`)}
							</Menu.Item>
						))}
					</Menu.Content>
				</Menu>
			</Toolbar>
		</MUAppBar>
	);
};

export default AppBar;
