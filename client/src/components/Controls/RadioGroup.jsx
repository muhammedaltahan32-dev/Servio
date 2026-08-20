import { Stack, RadioGroup as MURadioGroup, FormControl, FormLabel } from "@mui/material";
import { propertiesSelection } from "@utils";
import React from "react";
import { STACK_PROPS } from "../constant.js";

export const RadioGroup = React.forwardRef(({ children, label, ...props }, ref) => {
	const StackProps = propertiesSelection(props, STACK_PROPS);
	return (
		<FormControl>
			{label && <FormLabel>{label}</FormLabel>}
			<MURadioGroup {...props} ref={ref}>
				<Stack {...StackProps}>{children}</Stack>
			</MURadioGroup>
		</FormControl>
	);
});
RadioGroup.displayName = "RadioGroup";
export default RadioGroup;
