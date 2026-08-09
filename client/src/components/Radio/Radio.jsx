import { Icon } from "../index.js";
import { FormControl, FormControlLabel, Stack, Radio as MURadio, FormHelperText } from "@mui/material";
import React from "react";

export const Radio = React.forwardRef(
	({ label, width, minWidth, helperText, labelPlacement, error, warning, ...props }, ref) => {
		return (
			<FormControl sx={{ width, minWidth }}>
				<FormControlLabel
					labelPlacement={labelPlacement}
					sx={{ gap: "0.2rem", userSelect: "none" }}
					control={
						<Stack direction="row" alignItems="center" spacing={1}>
							<MURadio ref={ref} {...props} />
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
Radio.displayName = "Radio";

export default Radio;
