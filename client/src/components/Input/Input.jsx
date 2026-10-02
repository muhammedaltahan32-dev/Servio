import React from "react";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";

export const Input = React.forwardRef(({ suffix, prefix, sx, inputProps = {}, slotProps = {}, ...props }, ref) => {
	const resolvedSX = React.useCallback(
		(theme) => {
			let overrideStyles = sx;
			if (typeof overrideStyles === "function") overrideStyles = overrideStyles(theme);
			return {
				"& .MuiOutlinedInput-root": {
					borderRadius: `${theme.tokens.radius.control}px`,
					transition: `box-shadow ${theme.tokens.motion.fast}, border-color ${theme.tokens.motion.fast}`,
					"&.Mui-focused": { boxShadow: `0 0 0 3px ${theme.palette.primary.main}20` },
				},
				"& .MuiInputBase-input": { minWidth: 0 },
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
				...slotProps,
				htmlInput: {
					...inputProps,
					...slotProps.htmlInput,
				},
				input: {
					...slotProps.input,
					startAdornment: prefix ? (
						<InputAdornment position="start">{prefix}</InputAdornment>
					) : (
						slotProps.input?.startAdornment
					),
					endAdornment: suffix ? (
						<InputAdornment position="end">{suffix}</InputAdornment>
					) : (
						slotProps.input?.endAdornment
					),
				},
			}}
			ref={ref}
		/>
	);
});
Input.displayName = "Input";
export default Input;
