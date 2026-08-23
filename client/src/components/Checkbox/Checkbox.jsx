import {
	Box,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	InputAdornment,
	Checkbox as MUCheckbox,
	Stack,
	styled,
} from "@mui/material";
import { Icon } from "../index";
import React from "react";
import WarningTwoToneIcon from "@mui/icons-material/WarningTwoTone";

export const Checkbox = React.forwardRef(
	({ label, width, minWidth, helperText, labelPlacement, error, warning, ...props }, ref) => {
		return (
			<FormControl sx={{ width, minWidth, display: "inline" }}>
				<FormControlLabel
					labelPlacement={labelPlacement}
					sx={{ gap: "0.2rem", userSelect: "none" }}
					control={
						<Stack direction="row" alignItems="center" spacing={1}>
							<MUCheckbox ref={ref} {...props} />
							{(error || warning) && (
								<Icon status={error ? "error" : "warning"} size="1rem" name={"WarningAmberRounded"} />
							)}
						</Stack>
					}
					label={label}
				/>
				{helperText && (
					<FormHelperText error={error} warning={warning}>
						{helperText}
					</FormHelperText>
				)}
			</FormControl>
		);
	},
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
