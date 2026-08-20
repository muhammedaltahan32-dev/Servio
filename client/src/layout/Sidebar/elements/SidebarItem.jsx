import { Icon } from "@components";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";

export const SidebarItem = React.forwardRef(({ label, icon, onClick, children, ...props }, ref) => {
	return (
		<ListItem disablePadding>
			<ListItemButton sx={(theme) => ({ borderRadius: theme.shape.borderRadius + "px" })} onClick={onClick}>
				{icon && <ListItemIcon>{typeof icon === "string" ? <Icon name={icon} /> : icon}</ListItemIcon>}
				{label && <ListItemText primary={label} />}
				{children}
			</ListItemButton>
		</ListItem>
	);
});
SidebarItem.displayName = "SidebarItem";
export default SidebarItem;
