import { Box, Toolbar } from "@mui/material";
import React, { Suspense } from "react";
import { useLocation, useOutlet } from "react-router";
import PageLoadingFallback from "../../components/PageLoadingFallback.jsx";
import { useActionsBar } from "../index.js";
import { motion, useReducedMotion } from "framer-motion";
export const Main = () => {
	const { isActionsBarOpened } = useActionsBar();
	const location = useLocation();
	const outlet = useOutlet();
	const prefersReducedMotion = useReducedMotion();
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
				<motion.div
					key={location.pathname}
					initial={prefersReducedMotion ? false : { opacity: 0, x: 14 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
				>
					{outlet}
				</motion.div>
			</Suspense>
		</Box>
	);
};

export default Main;
