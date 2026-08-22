import React, { useState } from "react";
import AppBar from "./Appbar/AppBar.jsx";
import { Box, CssBaseline } from "@mui/material";
import SideBar from "./Sidebar/SideBar.jsx";
import Main from "./Main/Main.jsx";

export default function Root() {
	return (
		<Box sx={{ display: "flex", overflow: "auto" }}>
			<CssBaseline />
			<AppBar />
			<SideBar />
			<Main />
		</Box>
	);
}
