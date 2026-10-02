import React from "react";
import {
	Dialog as MuiDialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Box,
	Grow,
	useMediaQuery,
	useTheme,
	IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MobileBottomSheet } from "../MobileBottomSheet/MobileBottomSheet.jsx";
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Grow direction="up" ref={ref} {...props} />;
});
const BOTTOM_SHEET_PROPS = {};
export const Dialog = ({
	open = false,
	disabled = false,
	onClose,
	title,
	subtitle,
	children,
	fullScreen,
	actions,
	disableEscape = true,
	disableBackdropClick = true,
	TransitionComponent = Transition,
	bottomSheetProps = BOTTOM_SHEET_PROPS,
	slotProps = {},
	...props
}) => {
	const handleClose = (event, reason) => {
		if ((disableBackdropClick && reason === "backdropClick") || (disableEscape && reason === "escapeKeyDown")) return;
		onClose?.(event, reason);
	};
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	if (!isMobile)
		return (
			<MuiDialog
				open={open}
				fullWidth
				maxWidth="sm"
				scroll="paper"
				onClose={handleClose}
				slots={{
					transition: TransitionComponent,
				}}
				slotProps={{
					...slotProps,
					paper: {
						...slotProps.paper,
						elevation: 0,
						sx: (theme) => {
							const callerSX = slotProps.paper?.sx;
							return {
								border: "1px solid",
								borderColor: "divider",
								borderRadius: `${theme.tokens.radius.panel}px`,
								bgcolor: "background.paper",
								color: "text.primary",
								backgroundImage: "none",
								boxShadow: theme.tokens.shadow.dialog,
								overflow: "hidden",
								pointerEvents: disabled ? "none" : "all",
								...(typeof callerSX === "function" ? callerSX(theme) : callerSX),
							};
						},
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
							pb: subtitle ? 2 : 2.5,
							pt: 2.5,
							px: 3,
							borderBottom: "1px solid",
							borderColor: "divider",
						}}
					>
						<Box>
							{title && (
									<Typography variant="h6" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.3, letterSpacing: "-0.01em" }}>
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
								size="small"
								onClick={(e) => onClose(e, "closeButtonClick")}
								disabled={disabled}
									sx={{ color: "text.secondary", ml: 1, flexShrink: 0 }}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						)}
					</DialogTitle>
				)}

				{/* Body Content */}
				<DialogContent sx={{ px: 3, py: 2.5 }}>{children}</DialogContent>

				{/* Footer Actions */}
				{actions && (
					<DialogActions
						sx={{
							px: 3,
							pb: 2.5,
							pt: 2,
							gap: 1,
							justifyContent: "flex-end",
							borderTop: "1px solid",
							borderColor: "divider",
						}}
					>
						{actions}
					</DialogActions>
				)}
			</MuiDialog>
		);
	return (
		<MobileBottomSheet open={open} onClose={onClose} title={title} subtitle={subtitle} actions={actions} {...bottomSheetProps}>
			{children}
		</MobileBottomSheet>
	);
};

export default Dialog;
