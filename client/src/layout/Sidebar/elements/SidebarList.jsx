import React from "react";
import SidebarItem from "./SidebarItem.jsx";
import { List } from "@mui/material";
import { sidebarMenu } from "@router";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { closeDrawer } from "../../../features/layout/layoutSlice.js";
export const SidebarList = () => {
	const { mobileOpen } = useSelector((state) => state.layout);
	const dispatch = useDispatch();
	const location = useLocation();
	const goto = useNavigate();
	return (
		<List disablePadding sx={{ padding: "0.8rem", flexGrow: "1" }}>
			{sidebarMenu.map((item) => (
				<SidebarItem
					key={item.label}
					icon={item.icon}
					label={item.label}
					sx={{ mt: 1 }}
					active={location.pathname === item.path}
					onClick={() => {
						goto(item.path);
						if (mobileOpen) dispatch(closeDrawer());
					}}
				/>
			))}
		</List>
	);
};

export default SidebarList;
