import { Box, Drawer } from "@mui/material";
import React from "react";
import { useActionsBar } from "../index.js";

export const ActionsBar = React.memo(() => {
	const { isActionsBarOpened, actionsBarContent } = useActionsBar();
	return (
		<Drawer
			variant="permanent"
			anchor="right"
			open={isActionsBarOpened}
			component="nav"
			sx={(theme) => ({
				display: {
					xs: "none",
					md: "block",
				},
				"& .MuiDrawer-paper": {
					boxSizing: "border-box",
					width: isActionsBarOpened ? theme.tokens.size.actionsBarWidth : 0,
					opacity: isActionsBarOpened ? 1 : 0,
					border: "none",
					bgcolor: "transparent",
					color: "text.primary",
					overflow: "auto",
					transition: `width ${theme.tokens.motion.fast} , opacity ${theme.tokens.motion.fast}`,
					height: `calc(100% - ${theme.tokens.size.appBarHeight}px)`,
					top: `calc(${theme.tokens.size.appBarHeight}px )`,
				},
			})}
		>
			<Box
				sx={(theme) => ({
					height: "100%",
					overflow: "auto",
					direction: theme.direction,
					padding: `${theme.tokens.space.pageXs}rem ${theme.tokens.space.pageXs}rem ${theme.tokens.space.pageXs}rem ${theme.tokens.space.section / 2}rem`,
				})}
			>
				<Box
					sx={(theme) => ({
						height: `calc(100% - ${theme.tokens.space.section / 4}rem)`,
						mt: `${theme.tokens.space.section / 4}rem`,
						direction: theme.direction,
						boxShadow: theme.tokens.shadow.card,
						border: "1px solid",
						borderColor: "divider",
						bgcolor: "background.paper",
						borderRadius: `${theme.tokens.radius.panel}px`,
					})}
				>
					<React.Activity mode={isActionsBarOpened ? "visible" : "hidden"}>{actionsBarContent}</React.Activity>
				</Box>
			</Box>
		</Drawer>
	);
});
ActionsBar.displayName = "ActionsBar";

export default ActionsBar;
