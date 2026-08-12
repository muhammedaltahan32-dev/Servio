import { Icon } from "../index.js";
import { IconButton as MUIconButton } from "@mui/material";
import React from "react";
export const IconButton = React.forwardRef(({ name, ...props }, ref) => {
	return (
		<MUIconButton {...props}>
			<Icon name={name} />
		</MUIconButton>
	);
});
IconButton.displayName = "IconButton";
export default IconButton;
