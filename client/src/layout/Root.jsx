import React, { useState } from "react";
import AppBar from "./Appbar/AppBar.jsx";
import { Box, useColorScheme } from "@mui/material";
import SideBar from "./Sidebar/SideBar.jsx";
import Main from "./Main/Main.jsx";
import { useDispatch } from "react-redux";
import { DESKTOP_DRAWER_WIDTH } from "./constant.js";

export default function Root() {
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch({ type: "socket/init" });
	}, [dispatch]);
	const { mode } = useColorScheme();
	const isDark = mode === "dark";
	const mainAriaRef = React.useRef(null);
	return (
		<Box
			sx={{
				height: "100dvh",
				display: "flex",
				overflow: "hidden",
				bgcolor: "background.paper",
			}}
		>
			<SideBar />
			<Box
				ref={mainAriaRef}
				sx={(theme) => {
					const primary = (opacity = 1) =>
						`color-mix(in srgb, ${theme.palette.primary.main} ${opacity * 100}%, transparent)`;
					return {
						// background: `radial-gradient(circle at top, ${primary(0.1)}, transparent 100%)`,
						bgcolor: "background.default",
						position: "relative",
						borderEndStartRadius: { md: theme.shape.borderRadius + "px", xs: 0 },
						borderStartStartRadius: { md: theme.shape.borderRadius + "px", xs: 0 },
						width: { md: `calc(100% - ${DESKTOP_DRAWER_WIDTH}px)`, xs: "100%" },
						minHeight: "100%",
						overflowY: "auto",
						overflowX: "hidden",
						display: "flex",
						flexDirection: "column",
					};
				}}
			>
				<AppBar mainScrollableElement={mainAriaRef} />
				<Main />
			</Box>
		</Box>
	);
}
