import React from "react";
import { DESKTOP_DRAWER_WIDTH } from "../constant.js";
import { Toolbar, Typography, AppBar as MUAppBar, Tooltip, useColorScheme, useScrollTrigger } from "@mui/material";
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
const AppBar = ({ mainScrollableElement }) => {
	const location = useLocation();
	const pageName = location.pathname.split("/").filter(Boolean).pop() || "";
	const { t, supportedLanguages, changeLanguage } = useLang();
	const dispatch = useDispatch();
	const handleDrawerToggle = () => {
		dispatch(drawerToggle());
	};
	const scrolled = useScrollTrigger({
		target: mainScrollableElement.current,
		threshold: 10,
	});
	return (
		<MUAppBar
			color="transparent"
			position="fixed"
			sx={(theme) => ({
				boxShadow: "none",
				width: { md: `calc(100% - ${DESKTOP_DRAWER_WIDTH}px )` },
				marginInlineStart: { md: `calc(${DESKTOP_DRAWER_WIDTH}px )` },
				// bgcolor: "background.paper",
				backdropFilter: "blur(20px)",
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
