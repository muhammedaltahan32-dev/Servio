import { Button as MUButton } from "@mui/material";
import React from "react";
export const Button = React.forwardRef(({ children, prefix, suffix, ...props }, ref) => {
	return (
		<MUButton ref={ref} variant="contained" {...props} startIcon={prefix} endIcon={suffix}>
			{children}
		</MUButton>
	);
});
Button.displayName = "Button";
export default Button;
