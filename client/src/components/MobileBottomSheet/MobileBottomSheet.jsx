import React, { useState } from "react";
import { Box, SwipeableDrawer, Typography, styled, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const drawerBleeding = 20;

// Styled visual handle bar for touch drag indication
const Puller = styled("div")(({ theme }) => ({
	width: 36,
	height: 4,
	backgroundColor: theme.palette.divider,
	borderRadius: theme.tokens.radius.pill,
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
	subtitle,
	anchor = "bottom",
	disableSwipeToOpen = true,
	maxHeight = "85vh",
	height = "auto",
	backwardButton = true,
	actions,
	...props
}) {
	// Configures iOS swipe back prevention optimization
	const iOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
	return (
		<>
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
							borderTopLeftRadius: `${theme.tokens.radius.panel}px`,
							borderTopRightRadius: `${theme.tokens.radius.panel}px`,
							height,
							maxHeight,
							overflow: "hidden",
							border: "1px solid",
							borderColor: "divider",
							bgcolor: "background.paper",
							boxShadow: theme.tokens.shadow.dialog,
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
						borderTopLeftRadius: `${theme.tokens.radius.panel}px`,
						borderTopRightRadius: `${theme.tokens.radius.panel}px`,
						pt: 2.5,
						pb: 2,
						px: 3,
						borderBottom: "1px solid",
						borderColor: "divider",
						backgroundColor: "background.paper",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					})}
				>
					<Puller />

					<Box sx={{ minWidth: 0, flex: 1, mt: 1 }}>
						{title && <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>{title}</Typography>}
						{subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
					</Box>

					{backwardButton && (
						<IconButton size="small" onClick={onClose} sx={{ mt: 1, flexShrink: 0 }} aria-label="Close dialog"><CloseIcon fontSize="small" /></IconButton>
					)}
				</Box>

				{/* Scrollable Main Content */}
				<Box
					sx={{
						px: 3,
						pb: "calc(24px + env(safe-area-inset-bottom))",
						pt: 1,
						minHeight: 0,
						overflowY: "auto",
					}}
				>
					{children}
				</Box>
				{actions && (
					<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, p: 2, pb: "calc(16px + env(safe-area-inset-bottom))", borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
						{actions}
					</Box>
				)}
			</SwipeableDrawer>
		</>
	);
}
export default MobileBottomSheet;
