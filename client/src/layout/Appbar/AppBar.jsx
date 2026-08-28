import React from "react";
import { DRAWER_WIDTH } from "../constant.js";
import { Toolbar, Typography, AppBar as MUAppBar, Tooltip, useColorScheme } from "@mui/material";
import { Icon, IconButton, MenuItem, Menu } from "@components";
import { useDispatch } from "react-redux";
import { drawerToggle } from "../../features/layout/layoutSlice.js";

import { useLang } from "@hooks";
import { useLocation } from "react-router";
const ThemeSwitcher = React.memo(() => {
	const { setMode, colorScheme } = useColorScheme();
	const { t } = useLang();
	const toggleMode = () => {
		setMode(colorScheme === "dark" ? "light" : "dark");
	};
	return (
		<Tooltip title={t(`layout.mode.${colorScheme}`)}>
			<IconButton
				sx={{ display: { md: "none" } }}
				onClick={toggleMode}
				name={colorScheme === "dark" ? "LightMode" : "DarkMode"}
			/>
		</Tooltip>
	);
});
ThemeSwitcher.displayName = "ThemeSwitcher";
const AppBar = () => {
	const location = useLocation();
	const pageName = location.pathname.split("/").filter(Boolean).pop() || "";
	const { t, supportedLanguages, changeLanguage } = useLang();
	const dispatch = useDispatch();
	const handleDrawerToggle = () => {
		dispatch(drawerToggle());
	};
	return (
		<MUAppBar
			color="transparent"
			position="fixed"
			sx={(theme) => ({
				boxShadow: "none",
				width: { md: `calc(100% - ${DRAWER_WIDTH}px - 3rem)` },
				marginInlineStart: { md: `calc(${DRAWER_WIDTH}px )`, xs: "none" },
				bgcolor: "background.paper",
				borderRadius: () => ({ md: theme.shape.borderRadius + "px", xs: "none" }),
				mt: { xs: "none", md: "1rem" },
				transition: "borderRadius 200ms ease, margin 200ms ease, width 200ms ease",
				marginInlineEnd: { xs: "none", md: "1rem" },
			})}
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
					{pageName}
				</Typography>
				<ThemeSwitcher />
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
