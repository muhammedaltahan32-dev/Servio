import { Icon } from "@components";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import React from "react";
const EMPTY_OBJECT = {};
const ItemIcon = React.memo(({ icon, active }) => {
	const theme = useTheme();

	if (!icon) return null;
	return (
		<ListItemIcon>
			{typeof icon === "string" ? <Icon name={icon} color={active ? theme.palette.primary.contrastText : ""} /> : icon}
		</ListItemIcon>
	);
});
ItemIcon.displayName = "ItemIcon";
export const SidebarItem = React.forwardRef(
	({ label, icon, onClick, children, sx = EMPTY_OBJECT, active, ...props }, ref) => {
		const memoizedStyle = React.useCallback(
			(theme) => {
				let overrideSX = sx;
				if (typeof overrideSX === "function") overrideSX = overrideSX(theme);
				let activeStyle = {};
				if (active) {
					activeStyle = {
						background: theme.palette.primary.gradient,
						color: theme.palette.primary.contrastText,
					};
				}
				return {
					padding: "0.4rem 0.5rem",
					borderRadius: theme.shape.borderRadius + "px",
					...activeStyle,
					...overrideSX,
				};
			},
			[active, sx],
		);
		return (
			<ListItem disablePadding>
				<ListItemButton sx={memoizedStyle} onClick={onClick}>
					<ItemIcon icon={icon} active={active} />
					{label && <ListItemText primary={label} />}
					{children}
				</ListItemButton>
			</ListItem>
		);
	},
);
SidebarItem.displayName = "SidebarItem";
export default SidebarItem;
