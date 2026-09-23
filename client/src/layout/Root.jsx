import React, { useState } from "react";
import AppBar from "./Appbar/AppBar.jsx";
import { Box, useColorScheme } from "@mui/material";
import SideBar from "./Sidebar/SideBar.jsx";
import Main from "./Main/Main.jsx";
import { useDispatch } from "react-redux";

export default function Root() {
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch({ type: "socket/init" });
	}, [dispatch]);
	const { mode } = useColorScheme();
	const isDark = mode === "dark";
	return (
		<Box
			id="rootLayout"
			sx={(theme) => {
				const primary = (opacity = 1) =>
					`color-mix(in srgb, ${theme.palette.primary.main} ${opacity * 100}%, transparent)`;
				return {
					// background: `radial-gradient(circle at top, ${primary(0.1)}, transparent 100%)`,
					bgcolor: "background.default",
					position: "relative",
					borderEndStartRadius: { md: theme.shape.borderRadius + "px", xs: 0 },
					borderStartStartRadius: { md: theme.shape.borderRadius + "px", xs: 0 },
					overflow: "auto",
					display: "flex",
					flexDirection: "column",
				};
			}}
		>
			<SideBar />
			<AppBar />
			<>
				<Main />
			</>
		</Box>
	);
}
