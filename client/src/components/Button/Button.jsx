import { Button as MUButton } from "@mui/material";
import React from "react";
export const Button = React.forwardRef(({ children, prefix, suffix, sx, color = "primary", ...props }, ref) => {
	const resolvedSX = React.useCallback(
		(theme) => {
			const overrides = typeof sx === "function" ? sx(theme) : sx;
			return {
				borderRadius: `${theme.tokens.radius.control}px`,
				fontWeight: 700,
				textTransform: "none",
				boxShadow: "none",
				transition: `transform ${theme.tokens.motion.fast}, box-shadow ${theme.tokens.motion.fast}, background-color ${theme.tokens.motion.fast}`,
				"&:hover": { boxShadow: theme.tokens.shadow.card, transform: "translateY(-1px)" },
				"&:active": { transform: "translateY(0)" },
				...overrides,
			};
		},
		[sx],
	);
	return (
		<MUButton ref={ref} color={color} variant="contained" {...props} sx={resolvedSX} startIcon={prefix} endIcon={suffix}>
			{children}
		</MUButton>
	);
});
Button.displayName = "Button";
export default Button;
