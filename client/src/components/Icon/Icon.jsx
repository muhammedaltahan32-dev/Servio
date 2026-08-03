import React from "react";
import * as MuiIcons from "@mui/icons-material";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import { Box } from "@mui/material";
export const Icon = React.forwardRef(
  ({ name, size, color, status, ...props }, ref) => {
    const IconComponent = React.useMemo(
      () => (MuiIcons[name] ? MuiIcons[name] : MuiIcons["HelpOutlineTwoTone"]),
      [name],
    );

    const properties = React.useMemo(
      () => ({
        ...props,
        color: status,
        htmlColor: color,
        sx: {
          fontSize: size || "1.2rem",
        },
      }),
      [color, status, size, props],
    );

    return (
      <Box
        ref={ref}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyCenter: "center",
        }}
      >
        <IconComponent {...properties} />
      </Box>
    );
  },
);
Icon.displayName = "Icon";
export default Icon;
