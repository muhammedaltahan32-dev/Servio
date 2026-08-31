import React from "react";
import { Select as MUSelect, InputLabel, FormControl, OutlinedInput, FormHelperText, FilledInput } from "@mui/material";
import { FORM_CONTROL_PROPS } from "../constant";
import { propertiesSelection } from "@utils";

export const Select = React.forwardRef(
	({ children, label, width, minWidth, helperText, error, warning, sx, ...props }, ref) => {
		const { variant = "outlined", ...formProps } = propertiesSelection(props, FORM_CONTROL_PROPS);
		const labelIdRef = React.useRef(null);
		if (!labelIdRef.current) {
			labelIdRef.current = `select-label-${Math.random().toString(36).substr(2, 9)}`;
		}
		const inputLabel = React.useMemo(() => {
			switch (variant) {
				case "filled":
					return <FilledInput label={label} />;
				default:
					return <OutlinedInput label={label} />;
			}
		}, [label, variant]);
		const resolvedSX = React.useCallback(
			(theme) => {
				let overrideStyles = sx;
				if (typeof overrideStyles === "function") overrideStyles = overrideStyles(theme);
				return {
					width,
					minWidth,
					borderRadius: theme.shape.borderRadius + "px",
					...overrideStyles,
				};
			},
			[sx, width, minWidth],
		);
		return (
			<FormControl {...formProps} variant={variant} sx={resolvedSX}>
				<InputLabel error={error} warning={warning} id={labelIdRef.current}>
					{label}
				</InputLabel>
				<MUSelect
					{...props}
					size="small"
					error={error}
					warning={warning}
					input={variant !== "standard" && inputLabel}
					labelId={labelIdRef.current}
					ref={ref}
				>
					{children}
				</MUSelect>
				{helperText && (
					<FormHelperText error={error} warning={warning}>
						{helperText}
					</FormHelperText>
				)}
			</FormControl>
		);
	},
);
Select.displayName = "Select";
export default Select;
