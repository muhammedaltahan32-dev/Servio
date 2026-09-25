import { Box, Drawer } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export const ActionsBar = React.memo(() => {
	const { isActionsBarOpened, actionsBarContent } = useSelector((state) => state.layout);
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
			<Box sx={{ height: "100%", overflow: "auto", direction: "rtl", padding: "1rem" }}>
				<Box
					sx={(theme) => ({
						height: "calc(100% - 0.5rem)",
						mt: "0.5rem",
						direction: "ltr",
						boxShadow: 1,
						bgcolor: "background.paper",
						borderRadius: theme.shape.borderRadius + "px",
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
