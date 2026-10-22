import React, { useId } from "react";
import {
	Select as MUSelect,
	InputLabel,
	FormControl,
	FormHelperText,
	OutlinedInput,
	FilledInput,
	Input,
	useTheme,
} from "@mui/material";
import { FORM_CONTROL_PROPS } from "../constant";
import { propertiesSelection } from "@utils";

export const Select = React.forwardRef(
	(
		{
			children,
			label,
			width,
			minWidth,
			helperText,
			error,
			warning,
			sx,
			value = "",
			variant,
			InputLabelProps,
			...props
		},
		ref,
	) => {
		const theme = useTheme();
		const resolvedVariant = variant ?? theme.tokens.components.selectVariant ?? "outlined";
		const formProps = propertiesSelection(props, FORM_CONTROL_PROPS);

		const selectProps = { ...props };
		Object.keys(formProps).forEach((key) => delete selectProps[key]);

		const generatedId = useId();
		const labelId = label ? `select-label-${generatedId}` : undefined;

		const resolvedSX = React.useCallback(
			(theme) => {
				let overrideStyles = sx;
				if (typeof overrideStyles === "function") {
					overrideStyles = overrideStyles(theme);
				}

				return {
					width,
					minWidth,
					...overrideStyles,
				};
			},
			[sx, width, minWidth],
		);

		const inputElement = React.useMemo(() => {
			switch (resolvedVariant) {
				case "filled":
					return <FilledInput label={label} />;
				case "standard":
					return <Input />;
				case "outlined":
				default:
					return <OutlinedInput label={label} />;
			}
		}, [label, resolvedVariant]);

		return (
			<FormControl {...formProps} variant={resolvedVariant} error={error} sx={resolvedSX} size={selectProps.size || "small"}>
				{label && (
					<InputLabel error={error} id={labelId} {...InputLabelProps}>
						{label}
					</InputLabel>
				)}

				<MUSelect {...selectProps} ref={ref} value={value} error={error} labelId={labelId} input={inputElement}>
					{children}
				</MUSelect>

				{helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
			</FormControl>
		);
	},
);

Select.displayName = "Select";
export default Select;
