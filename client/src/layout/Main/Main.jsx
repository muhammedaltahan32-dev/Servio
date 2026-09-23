import { Box, Toolbar } from "@mui/material";
import React from "react";
import { DESKTOP_DRAWER_WIDTH } from "../constant.js";
import { Outlet } from "react-router";

export const Main = () => {
	return (
		<Box
			component="main"
			sx={{
				flexGrow: 1,

				// minHeight: "100vh",
				// backgroundColor: (theme) => theme.palette.grey[100],
			}}
		>
			<Toolbar />
			<Box
				sx={{
					maxHeight: "calc(100vh - 64px)",
					height: "100%",
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Main;
