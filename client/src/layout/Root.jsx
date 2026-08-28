import React, { useState } from "react";
import AppBar from "./Appbar/AppBar.jsx";
import { Box } from "@mui/material";
import SideBar from "./Sidebar/SideBar.jsx";
import Main from "./Main/Main.jsx";

export default function Root() {
	return (
		<Box sx={{ display: "flex", overflow: "auto" }}>
			<AppBar />
			<SideBar />
			<Main />
		</Box>
	);
}
