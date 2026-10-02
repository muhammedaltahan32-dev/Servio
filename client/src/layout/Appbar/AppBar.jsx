import React from "react";
import { Toolbar, Typography, AppBar as MUAppBar, Tooltip, useColorScheme, useScrollTrigger, useTheme } from "@mui/material";
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
	const { t, supportedLanguages, changeLanguage } = useLang();
	const routeTitleKeys = {
		"/": "home.title",
		"/categories": "categories.title",
		"/lobby": "lobby.title",
		"/tables": "tables.title",
		"/users": "users.title",
		"/menu-items": "menuItems.title",
		"/customer-menu": "customerMenu.title",
	};
	const routeKey = location.pathname.startsWith("/customer-menu/") ? "/customer-menu" : location.pathname.toLowerCase();
	const pageName = routeTitleKeys[routeKey]
		? t(routeTitleKeys[routeKey])
		: (location.pathname.split("/").filter(Boolean).pop() || t("home.title"))
				.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
				.replace(/[-_]/g, " ")
				.replace(/\b\w/g, (character) => character.toUpperCase());
	const dispatch = useDispatch();
	const theme = useTheme();
	const handleDrawerToggle = () => {
		dispatch(drawerToggle());
	};
	const scrolled = useScrollTrigger({
		disableHysteresis: true,
		threshold: 60,
	});
	return (
		<MUAppBar
			color="transparent"
			position="fixed"
			sx={(theme) => ({
				height: { xs: `${theme.tokens.size.mobileAppBarHeight}px`, md: `${theme.tokens.size.appBarHeight}px` },
				width: { md: `calc(100% -  ${theme.layout["desktop-drawer-width"]}px )` },
				marginInlineStart: { md: `calc(${theme.layout["desktop-drawer-width"]}px )` },
				bgcolor: "background.appBar",
				backdropFilter: `blur(${theme.tokens.effect.appBarBlur})`,
				borderBottom: "1px solid",
				borderColor: scrolled ? "divider" : "transparent",
				boxShadow: "none",
				// transition: `border-color ${theme.tokens.motion.standard}, background-color ${theme.tokens.motion.standard}`,
			})}
		>
			<Toolbar sx={{ minHeight: { xs: `${theme.tokens.size.mobileAppBarHeight}px`, md: `${theme.tokens.size.appBarHeight}px` }, px: { xs: theme.tokens.space.pageXs, md: theme.tokens.space.pageMd } }}>
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

				<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700, color: "text.primary", textTransform: "capitalize" }}>
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
