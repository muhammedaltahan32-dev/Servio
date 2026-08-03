import {
  Box,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputAdornment,
  Switch as MUSwitch,
  Stack,
  styled,
} from "@mui/material";
import { Icon } from "../index";
import React from "react";
import WarningTwoToneIcon from "@mui/icons-material/WarningTwoTone";
const IOSSwitch = React.forwardRef((props, ref) => (
  <MUSwitch
    ref={ref}
    focusVisibleClassName="Mui-focusVisible"
    disableRipple
    {...props}
  />
));
IOSSwitch.displayName = "IOSSwitch";
const IOSSwitchStyled = styled(IOSSwitch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#39cf1b",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33d69f",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
    boxShadow: "0 2px 4px 0 rgba(0,35,110,0.2)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
export const Switch = React.forwardRef(
  (
    {
      label,
      classes,
      row,
      width,
      minWidth,
      helperText,
      labelPlacement,
      error,
      warning,
      ...props
    },
    ref,
  ) => {
    return (
      <FormGroup classes={classes} row={row} sx={{ width, minWidth }}>
        <FormControlLabel
          labelPlacement={labelPlacement}
          sx={{ gap: "1rem", userSelect: "none" }}
          control={
            <Stack direction="row" alignItems="center" spacing={1}>
              <IOSSwitchStyled ref={ref} {...props} />
              {(error || warning) && (
                <Icon
                  status={error ? "error" : "warning"}
                  size="1rem"
                  name={"WarningAmberRounded"}
                />
              )}
            </Stack>
          }
          label={label}
        />
        {helperText && (
          <FormHelperText error={error} warning={warning}>
            {helperText}
          </FormHelperText>
        )}
      </FormGroup>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
