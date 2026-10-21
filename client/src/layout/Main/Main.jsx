import { Box, Toolbar } from "@mui/material";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import PageLoadingFallback from "../../components/PageLoadingFallback.jsx";
import { useActionsBar } from "../index.js";
export const Main = () => {
	const { isActionsBarOpened } = useActionsBar();
	return (
		<Box
			component="main"
			sx={(theme) => ({
				flexGrow: 1,
				width: {
					xs: "100%",
					md: `calc(100% - ${theme.tokens.size.desktopDrawerWidth}px - ${isActionsBarOpened ? theme.tokens.size.actionsBarWidth : 0}px )`,
				},
				height: {
					xs: `calc(100% - ${theme.tokens.size.mobileAppBarHeight}px)`,
					md: `calc(100% - ${theme.tokens.size.appBarHeight}px)`,
				},
				marginInlineStart: { md: `calc(${theme.tokens.size.desktopDrawerWidth}px )` },
				marginInlineEnd: { md: `calc(${isActionsBarOpened ? theme.tokens.size.actionsBarWidth : 0}px  )` },
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
