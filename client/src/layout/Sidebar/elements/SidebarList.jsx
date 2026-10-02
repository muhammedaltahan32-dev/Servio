import React from "react";
import { List, useMediaQuery, useTheme } from "@mui/material";
import { sidebarMenu } from "@router";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { closeDrawer } from "../../../features/layout/layoutSlice.js";
import SidebarItem from "./SidebarItem.jsx";

export const SidebarList = () => {
	const mobileOpen = useSelector((state) => state.layout.mobileOpen);

	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
	const mobileOpenRef = React.useRef(mobileOpen);
	React.useEffect(() => {
		mobileOpenRef.current = mobileOpen;
	}, [mobileOpen]);
	const handleNavigate = React.useCallback((path) => {
		navigate(path);

		if (mobileOpenRef.current) {
			dispatch(closeDrawer());
		}
	}, [dispatch, navigate]);
	const itemClickHandlers = React.useMemo(
		() => new Map(sidebarMenu.map((item) => [item.path, () => handleNavigate(item.path)])),
		[handleNavigate],
	);

	return (
		<List
			disablePadding
			sx={(theme) => ({
				width: "100%",
				// height: "100%",
				overflow: "auto",
				scrollbarWidth: "none",
				p: isSmallScreen ? 1 : 1.5,
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
						onClick={itemClickHandlers.get(item.path)}
					/>
				);
			})}
		</List>
	);
};

export default SidebarList;
