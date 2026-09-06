import React, { useState } from "react";
import AppBar from "./Appbar/AppBar.jsx";
import { Box } from "@mui/material";
import SideBar from "./Sidebar/SideBar.jsx";
import Main from "./Main/Main.jsx";
import { useDispatch } from "react-redux";

export default function Root() {
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch({ type: "socket/init" });
	}, [dispatch]);
	return (
		<Box sx={{ display: "flex", overflow: "auto" }}>
			<AppBar />
			<SideBar />
			<Main />
		</Box>
	);
}
