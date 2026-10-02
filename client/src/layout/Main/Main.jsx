import { Box, Toolbar } from "@mui/material";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import PageLoadingFallback from "../../components/PageLoadingFallback.jsx";

export const Main = () => {
	const isActionsBarOpened = useSelector((state) => state.layout.isActionsBarOpened);
	return (
		<Box
			component="main"
			sx={(theme) => ({
				flexGrow: 1,
				width: {
					xs: "100%",
					md: `calc(100% - ${theme.layout["desktop-drawer-width"]}px - ${isActionsBarOpened ? theme.layout["desktop-actions-bar-width"] : 0}px )`,
				},
				height: `calc(100% - ${theme.layout["desktop-appbar-height"]}px)`,
				marginInlineStart: { md: `calc(${theme.layout["desktop-drawer-width"]}px )` },
				marginInlineEnd: { md: `calc(${isActionsBarOpened ? theme.layout["desktop-actions-bar-width"] : 0}px  )` },
				margin: "auto",
				transition: `width ${theme.tokens.motion.fast}, margin ${theme.tokens.motion.standard}`,
				px: { xs: theme.tokens.space.pageXs, md: theme.tokens.space.pageMd },
			})}
		>
			<Toolbar />

			<Suspense fallback={<PageLoadingFallback />}>
				<Outlet />
			</Suspense>
		</Box>
	);
};

export default Main;
