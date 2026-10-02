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
import React from "react";
import WarningTwoToneIcon from "@mui/icons-material/WarningTwoTone";

export const Checkbox = React.forwardRef(
	({ label, width, minWidth, helperText, labelPlacement, formControlLabelSx, error, warning, ...props }, ref) => {
		return (
			<FormControl sx={{ width, minWidth, display: "inline" }}>
				<FormControlLabel
					labelPlacement={labelPlacement}
					sx={{ gap: "0.2rem", userSelect: "none", ...formControlLabelSx }}
					control={
						<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
							<MUCheckbox ref={ref} {...props} />
							{(error || warning) && (
								<WarningTwoToneIcon color={error ? "error" : "warning"} sx={{ fontSize: "1rem" }} />
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
