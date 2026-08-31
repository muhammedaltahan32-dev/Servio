import React from "react";
import * as MuiIcons from "@mui/icons-material";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import { Box } from "@mui/material";
const EMPTY_OBJECT = {};
export const Icon = React.forwardRef(({ name, size, color, status, sx = EMPTY_OBJECT, ...props }, ref) => {
	const IconComponent = React.useMemo(() => (MuiIcons[name] ? MuiIcons[name] : MuiIcons["HelpOutlineTwoTone"]), [name]);

	const properties = React.useMemo(
		() => ({
			...props,
			color: status,
			htmlColor: color,
			sx: {
				fontSize: size,
			},
		}),
		[color, status, size, props],
	);
	const resolvedSX = React.useCallback(
		(theme) => {
			let overrideStyles = sx;
			if (typeof overrideStyles === "function") overrideStyles = overrideStyles(theme);
			return {
				display: "inline-flex",
				alignItems: "center",
				justifyCenter: "center",
				...overrideStyles,
			};
		},
		[sx],
	);

	return (
		<Box ref={ref} sx={resolvedSX}>
			<IconComponent {...properties} />
		</Box>
	);
});
Icon.displayName = "Icon";
export default Icon;
