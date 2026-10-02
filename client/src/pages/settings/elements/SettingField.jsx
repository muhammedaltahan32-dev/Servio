import React from "react";
import { Box, Slider, Stack, Typography } from "@mui/material";
import { Input } from "@components";
import { formatSizeValue, parseSizeValue } from "../utils/index.js";
import ColorSelector from "./ColorSelector.jsx";
import SettingResetButton from "./SettingResetButton.jsx";
import SizeExample from "./SizeExample.jsx";

const SettingFieldComponent = ({ value, defaultValue, update, stageUpdate, path, label, resetLabel, colorResetEpoch, color = false, sizeControl, helperText }) => {
	const numeric = typeof value === "number";
	const [pickerResetEpoch, setPickerResetEpoch] = React.useState(0);
	const handleChange = React.useCallback((nextValue) => update(path, nextValue), [path, update]);
	const handleColorChange = React.useCallback((nextValue) => stageUpdate(path, nextValue), [path, stageUpdate]);
	const handleSizeChange = React.useCallback((_, nextValue) => handleChange(formatSizeValue(nextValue, value, sizeControl)), [handleChange, sizeControl, value]);
	const handleReset = React.useCallback(() => {
		if (color) setPickerResetEpoch((current) => current + 1);
		handleChange(defaultValue);
	}, [color, defaultValue, handleChange]);

	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: { xs: "1fr", sm: "minmax(150px, 0.8fr) minmax(180px, 1.2fr)" },
				alignItems: "center",
				gap: { xs: 0.75, sm: 2 },
				py: 1.25,
				borderBottom: "1px solid",
				borderColor: "divider",
				"&:last-child": { borderBottom: 0, pb: 0 },
			}}
		>
			<Typography variant="body2" fontWeight={600} color="text.primary">{label}</Typography>
			<Stack direction="row" spacing={0.5} sx={{ alignItems: "center", minWidth: 0 }}>
				{sizeControl ? (
					<Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 68px", gap: 1, alignItems: "center", flex: 1, minWidth: 0 }}>
						<Stack direction="row" spacing={0.75} sx={{ alignItems: "center", minWidth: 0 }}>
							<Slider
								size="small"
								aria-label={label}
								value={parseSizeValue(value)}
								min={sizeControl.min}
								max={sizeControl.max}
								step={sizeControl.step}
								getAriaValueText={(nextValue) => `${nextValue}${sizeControl.unit}`}
								onChange={handleSizeChange}
								sx={{ flex: 1, minWidth: 0, mx: 0.5 }}
							/>
							<Typography variant="caption" dir="ltr" sx={{ minWidth: 42, textAlign: "end", whiteSpace: "nowrap" }}>
								{typeof value === "number" ? `${value}${sizeControl.unit === "sp" ? " sp" : " px"}` : value}
							</Typography>
							<SettingResetButton label={resetLabel} onClick={handleReset} />
						</Stack>
						<SizeExample value={value} control={sizeControl} label={label} />
					</Box>
				) : color ? (
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<ColorSelector key={`${colorResetEpoch}-${pickerResetEpoch}`} value={value} onChange={handleColorChange} label={label} />
					</Box>
				) : (
					<Input
						fullWidth
						aria-label={label}
						value={value ?? ""}
						type={numeric ? "number" : "text"}
						onChange={(event) => handleChange(numeric ? (event.target.value === "" ? "" : Number(event.target.value)) : event.target.value)}
						size="small"
						helperText={helperText}
						inputProps={numeric ? { step: "any" } : undefined}
						sx={{ minWidth: 0 }}
					/>
				)}
				{!sizeControl && <SettingResetButton label={resetLabel} onClick={handleReset} />}
			</Stack>
		</Box>
	);
};

const SettingField = React.memo(SettingFieldComponent);
SettingField.displayName = "SettingField";

export default SettingField;
