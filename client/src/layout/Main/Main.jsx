import { Box, Toolbar } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";

export const Main = () => {
	const { isActionsBarOpened } = useSelector((state) => state.layout);
	return (
		<Box
			component="main"
			sx={(theme) => ({
				flexGrow: 1,
				width: {
					md: `calc(100% - ${theme.layout["desktop-drawer-width"]}px - ${isActionsBarOpened ? theme.layout["desktop-actions-bar-width"] : 0}px )`,
				},
				height: `calc(100% - ${theme.layout["desktop-appbar-height"]}px)`,
				marginInlineStart: { md: `calc(${theme.layout["desktop-drawer-width"]}px )` },
				marginInlineEnd: { md: `calc(${isActionsBarOpened ? theme.layout["desktop-actions-bar-width"] : 0}px  )` },
				margin: "auto",
				transition: "width 0.2s ease, margin 0.3s ease",
			})}
		>
			<Toolbar />

			<Outlet />
		</Box>
	);
};

export default Main;
