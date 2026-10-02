import { Box, Drawer } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export const ActionsBar = React.memo(() => {
	const isActionsBarOpened = useSelector((state) => state.layout.isActionsBarOpened);
	const actionsBarContent = useSelector((state) => state.layout.actionsBarContent);
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
					width: isActionsBarOpened ? theme.layout["desktop-actions-bar-width"] : 0,
					opacity: isActionsBarOpened ? 1 : 0,
					border: "none",
					bgcolor: "transparent",
					color: "text.primary",
					overflow: "auto",
					transition: "width 0.3s ease, opacity 0.5s ease",

					height: `calc(100% - ${theme.layout["desktop-appbar-height"]}px)`,

					top: `calc(${theme.layout["desktop-appbar-height"]}px )`,
				},
			})}
		>
			<Box sx={(theme) => ({ height: "100%", overflow: "auto", direction: theme.direction, padding: `${theme.tokens.space.pageXs}rem ${theme.tokens.space.pageXs}rem ${theme.tokens.space.pageXs}rem ${theme.tokens.space.section / 2}rem` })}>
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
