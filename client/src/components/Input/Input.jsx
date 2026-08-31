import React from "react";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";

export const Input = React.forwardRef(({ suffix, prefix, sx, ...props }, ref) => {
	const resolvedSX = React.useCallback(
		(theme) => {
			let overrideStyles = sx;
			if (typeof overrideStyles === "function") overrideStyles = overrideStyles(theme);
			return {
				borderRadius: theme.shape.borderRadius + "px",
				...overrideStyles,
			};
		},
		[sx],
	);
	return (
		<TextField
			size="small"
			{...props}
			sx={resolvedSX}
			slotProps={{
				input: {
					startAdornment: prefix && <InputAdornment position="start">{prefix}</InputAdornment>,
					endAdornment: suffix && <InputAdornment position="end">{suffix}</InputAdornment>,
				},
			}}
			ref={ref}
		/>
	);
});
Input.displayName = "Input";
export default Input;
