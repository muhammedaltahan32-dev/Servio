import React from "react";
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Fade } from "@mui/material";
import { IconButton } from "../index.js";

export const Dialog = ({
	open = false,
	disabled = false,
	onClose,
	title,
	subtitle,
	children,
	actions,
	maxWidth = "sm",
	fullWidth = true,
	disableEscape = true,
	disableBackdropClick = true,
	TransitionComponent = Fade,
	...props
}) => {
	const handleClose = (event, reason) => {
		if ((disableBackdropClick && reason === "backdropClick") || (disableEscape && reason === "escapeKeyDown")) return;
		onClose?.(event, reason);
	};

	return (
		<MuiDialog
			open={open}
			onClose={handleClose}
			fullWidth={fullWidth}
			maxWidth={maxWidth}
			// TransitionComponent={TransitionComponent}
			paper={{
				elevation: 0,
				sx: {
					border: "1px solid",
					borderColor: "divider",
					p: 1,
					pointerEvents: disabled ? "none" : "all",
				},
			}}
			{...props}
		>
			{/* Header */}
			{(title || subtitle || onClose) && (
				<DialogTitle
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						pb: subtitle ? 1 : 1.5,
						pt: 1.5,
						px: 2.5,
					}}
				>
					<Box>
						{title && (
							<Typography variant="h6" fontWeight={700} color="text.primary">
								{title}
							</Typography>
						)}
						{subtitle && (
							<Typography variant="body2" color="text.secondary" mt={0.5}>
								{subtitle}
							</Typography>
						)}
					</Box>

					{onClose && (
						<IconButton
							name="Close"
							size="small"
							onClick={(e) => onClose(e, "closeButtonClick")}
							disabled={disabled}
							sx={{ color: "text.secondary", ml: 1 }}
						/>
					)}
				</DialogTitle>
			)}

			{/* Body Content */}
			<DialogContent sx={{ px: 2.5, py: 1.5 }}>{children}</DialogContent>

			{/* Footer Actions */}
			{actions && (
				<DialogActions
					sx={{
						px: 2.5,
						pb: 1.5,
						pt: 1,
						gap: 1,
						justifyContent: "flex-end",
					}}
				>
					{actions}
				</DialogActions>
			)}
		</MuiDialog>
	);
};

export default Dialog;
