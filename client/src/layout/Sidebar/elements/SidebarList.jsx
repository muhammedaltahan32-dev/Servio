import React from "react";
import { List, useMediaQuery, useTheme } from "@mui/material";
import { sidebarMenu } from "@router";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { closeDrawer } from "../../../features/layout/layoutSlice.js";
import SidebarItem from "./SidebarItem.jsx";

export const SidebarList = () => {
	const { mobileOpen } = useSelector((state) => state.layout);

	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
	const handleNavigate = (path) => {
		navigate(path);

		if (mobileOpen) {
			dispatch(closeDrawer());
		}
	};

	return (
		<List
			disablePadding
			sx={(theme) => ({
				width: "100%",
				// height: "100%",
				overflow: "auto",
				scrollbarWidth: "none",
				...(isSmallScreen
					? {
							p: 1,
						}
					: {
							bgcolor: "background.default",
						}),
			})}
		>
			{sidebarMenu.map((item) => {
				const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

				return (
					<SidebarItem
						key={item.path || item.label}
						icon={item.icon}
						label={item.label}
						active={isActive}
						onClick={() => handleNavigate(item.path)}
					/>
				);
			})}
		</List>
	);
};

export default SidebarList;
