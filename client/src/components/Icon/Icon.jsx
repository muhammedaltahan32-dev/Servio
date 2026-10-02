import React from "react";
import Category from "@mui/icons-material/Category";
import DarkMode from "@mui/icons-material/DarkMode";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import Home from "@mui/icons-material/Home";
import Language from "@mui/icons-material/Language";
import LightMode from "@mui/icons-material/LightMode";
import Menu from "@mui/icons-material/Menu";
import People from "@mui/icons-material/People";
import RestaurantMenu from "@mui/icons-material/RestaurantMenu";
import Settings from "@mui/icons-material/Settings";
import Storefront from "@mui/icons-material/Storefront";
import TableBarTwoTone from "@mui/icons-material/TableBarTwoTone";
import TableRestaurant from "@mui/icons-material/TableRestaurant";
import { Box } from "@mui/material";

const ICONS = {
	Category,
	DarkMode,
	Home,
	Language,
	LightMode,
	Menu,
	People,
	RestaurantMenu,
	Settings,
	Storefront,
	TableBarTwoTone,
	TableRestaurant,
};
const EMPTY_OBJECT = {};
export const Icon = React.forwardRef(({ name, size, color, status, sx = EMPTY_OBJECT, ...props }, ref) => {
	const IconComponent = ICONS[name] ?? HelpOutlineTwoToneIcon;

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
