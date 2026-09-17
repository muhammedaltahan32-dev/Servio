import React, { useState } from "react";
import { Global, css } from "@emotion/react";
import { Box, Button, CssBaseline, SwipeableDrawer, Typography, styled, useTheme } from "@mui/material";
import { IconButton } from "../index.js";

const drawerBleeding = 20;

// Styled visual handle bar for touch drag indication
const Puller = styled("div")(({ theme }) => ({
	width: 32,
	height: 4,
	backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
	borderRadius: 3,
	position: "absolute",
	top: 8,
	left: "calc(50% - 16px)",
}));

export function MobileBottomSheet({
	open,
	onOpen,
	onClose,
	children,
	title,
	anchor = "bottom",
	disableSwipeToOpen = true,
	maxHeight = "85vh",
	height = "auto",
	backwardButton = true,
	...props
}) {
	// Configures iOS swipe back prevention optimization
	const iOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
	const theme = useTheme();

	const isRtl = theme.direction === "rtl";
	return (
		<>
			<CssBaseline />
			<SwipeableDrawer
				anchor={anchor}
				open={open}
				onClose={onClose}
				onOpen={onOpen}
				disableSwipeToOpen={disableSwipeToOpen}
				swipeAreaWidth={drawerBleeding}
				{...props}
				ModalProps={{
					keepMounted: true, // Improves open performance on mobile
				}}
				slotProps={{
					paper: {
						sx: (theme) => ({
							borderTopLeftRadius: theme.shape.borderRadius + "px",
							borderTopRightRadius: theme.shape.borderRadius + "px",
							height,
							maxHeight,
							overflow: "visible",
						}),
					},
				}}
				disableBackdropTransition={!iOS}
			>
				{/* Top Header / Drag Handle Container */}
				<Box
					className="bottomSheetPaper"
					sx={(theme) => ({
						position: "relative",
						borderTopLeftRadius: theme.shape.borderRadius + "px",
						borderTopRightRadius: theme.shape.borderRadius + "px",
						pt: 2,
						pb: 1,
						px: 2,
						backgroundColor: "background.paper",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					})}
				>
					<Puller />

					<Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
						{title}
					</Typography>

					{backwardButton && (
						<IconButton size="small" onClick={onClose} sx={{ mt: 1 }} name={!isRtl ? "ArrowForward" : "ArrowBack"} />
					)}
				</Box>

				{/* Scrollable Main Content */}
				<Box
					sx={{
						px: 2,
						pb: 3,
						pt: 1,
						height: "100%",
						overflowY: "auto",
					}}
				>
					{children}
				</Box>
			</SwipeableDrawer>
		</>
	);
}
export default MobileBottomSheet;
