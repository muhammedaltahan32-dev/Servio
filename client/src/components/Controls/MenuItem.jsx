import { MenuItem as MUItem } from "@mui/material";
import React from "react";

export const MenuItem = ({ children, ...props }) => {
  return (
    <MUItem
      {...props}
      sx={{
        color: "primary.main",
        margin: "0.2rem ",
        borderRadius: "4px",
      }}
    >
      {children}
    </MUItem>
  );
};
MenuItem.displayName = "MenuItem";

export default MenuItem;
