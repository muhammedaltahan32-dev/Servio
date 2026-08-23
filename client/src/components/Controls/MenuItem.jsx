import { MenuItem as MUItem } from "@mui/material";
import React from "react";

export const MenuItem = ({ children, ...props }) => {
	return <MUItem {...props}>{children}</MUItem>;
};
MenuItem.displayName = "MenuItem";

export default MenuItem;
