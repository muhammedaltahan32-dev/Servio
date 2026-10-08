import { Icon } from "../Icon/Icon.jsx";
import { IconButton as MUIconButton } from "@mui/material";
import React from "react";
export const IconButton = React.forwardRef(({ name, children, size, ...props }, ref) => {
	return (
		<MUIconButton ref={ref} {...props}>
			{children ?? (name ? <Icon name={name} size={size} /> : null)}
		</MUIconButton>
	);
});
IconButton.displayName = "IconButton";
export default IconButton;
