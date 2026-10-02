import { FormControl, FormControlLabel, Stack, Radio as MURadio, FormHelperText } from "@mui/material";
import React from "react";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";

export const Radio = React.forwardRef(
	({ label, width, minWidth, helperText, labelPlacement, error, warning, ...props }, ref) => {
		return (
			<FormControl sx={{ width, minWidth }}>
				<FormControlLabel
					labelPlacement={labelPlacement}
					sx={{ gap: "0.2rem", userSelect: "none" }}
					control={
						<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
							<MURadio ref={ref} {...props} />
							{(error || warning) && (
								<WarningAmberRounded color={error ? "error" : "warning"} sx={{ fontSize: "1rem" }} />
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
Radio.displayName = "Radio";

export default Radio;
