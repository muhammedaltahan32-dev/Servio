import { Box, Toolbar } from "@mui/material";
import React from "react";
import { DRAWER_WIDTH } from "../constant.js";
import { Outlet } from "react-router";

export const Main = () => {
	return (
		<Box
			component="main"
			sx={{
				flexGrow: 1,
				width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
				minHeight: "100vh",
				// backgroundColor: (theme) => theme.palette.grey[100],
			}}
		>
			<Toolbar />
			<Box sx={{ maxHeight: "calc(100vh - 64px)", height: "100%", p: 3 }}>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Main;
