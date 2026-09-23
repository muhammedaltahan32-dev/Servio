import { Box, Toolbar } from "@mui/material";
import React from "react";
import { Outlet } from "react-router";

export const Main = () => {
	return (
		<Box
			component="main"
			sx={(theme) => ({
				flexGrow: 1,
				width: { md: `calc(100% - ${theme.layout["desktop-drawer-width"]}px )` },
				marginInlineStart: { md: `calc(${theme.layout["desktop-drawer-width"]}px )` },
			})}
		>
			<Toolbar />
			<Box
				sx={(theme) => ({
					maxHeight: `calc(100dvh - ${theme.layout["desktop-appbar-height"]}px)`,
					height: "100%",
				})}
			>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Main;
