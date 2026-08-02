import React from "react";
import {
  Select as MUSelect,
  InputLabel,
  FormControl,
  OutlinedInput,
  FormHelperText,
  FilledInput,
} from "@mui/material";
import { FORM_CONTROL_PROPS } from "../constant";
import { propertiesSelection } from "@utils";

export const Select = React.forwardRef(
  ({ children, label, width, minWidth, helperText, ...props }, ref) => {
    const { variant = "outlined", formProps } = propertiesSelection(
      props,
      FORM_CONTROL_PROPS,
    );
    const labelIdRef = React.useRef(null);
    if (!labelIdRef.current) {
      labelIdRef.current = `select-label-${Math.random().toString(36).substr(2, 9)}`;
    }
    const inputLabel = React.useMemo(() => {
      switch (variant) {
        case "filled":
          return <FilledInput label={label} />;
        default:
          return <OutlinedInput label={label} />;
      }
    }, [label, variant]);
    return (
      <FormControl {...formProps} variant={variant} sx={{ width, minWidth }}>
        <InputLabel id={labelIdRef.current}>{label}</InputLabel>
        <MUSelect
          {...props}
          input={variant !== "standard" && inputLabel}
          labelId={labelIdRef.current}
          ref={ref}
        >
          {children}
        </MUSelect>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  },
);
Select.displayName = "Select";
export default Select;
