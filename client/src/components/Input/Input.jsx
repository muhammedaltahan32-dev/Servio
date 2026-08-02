import React from "react";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";

export const Input = React.forwardRef(({ suffix, prefix, ...props }, ref) => {
  return (
    <TextField
      {...props}
      slotProps={{
        input: {
          startAdornment: prefix && (
            <InputAdornment position="start">{prefix}</InputAdornment>
          ),
          endAdornment: suffix && (
            <InputAdornment position="end">{suffix}</InputAdornment>
          ),
        },
      }}
      ref={ref}
    />
  );
});
Input.displayName = "Input";
export default Input;
