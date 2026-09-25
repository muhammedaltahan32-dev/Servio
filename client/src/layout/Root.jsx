import React, { useState } from "react";
import AppBar from "./Appbar/AppBar.jsx";
import { Box, useColorScheme } from "@mui/material";
import SideBar from "./Sidebar/SideBar.jsx";
import Main from "./Main/Main.jsx";
import { useDispatch } from "react-redux";
import ActionsBar from "./ActionsBar/ActionsBar.jsx";

export default function Root() {
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch({ type: "socket/init" });
	}, [dispatch]);
	const { mode } = useColorScheme();
	const isDark = mode === "dark";
	return (
		<Box
			sx={(theme) => {
				const primary = (opacity = 1) =>
					`color-mix(in srgb, ${theme.palette.primary.main} ${opacity * 100}%, transparent)`;
				return {
					bgcolor: "background.default",
					position: "relative",
					borderEndStartRadius: { md: theme.shape.borderRadius + "px", xs: 0 },
					borderStartStartRadius: { md: theme.shape.borderRadius + "px", xs: 0 },
					display: "flex",
					height: "100%",
					flexDirection: "column",
				};
			}}
		>
			<SideBar />
			<ActionsBar />
			<AppBar />
			<Main />
		</Box>
	);
}
