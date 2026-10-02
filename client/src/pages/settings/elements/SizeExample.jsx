import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { parseSizeValue } from "../utils/index.js";

const SizeExample = React.memo(({ value, control, label }) => {
	const theme = useTheme();
	const amount = parseSizeValue(value);
	const cssValue = typeof value === "number" ? `${value}px` : value;
	const sampleSize = `min(100%, max(8px, ${cssValue}))`;
	const shortSize = `min(40px, max(8px, ${cssValue}))`;
	const example = control.preview === "font"
		? <Typography component="span" sx={{ fontSize: cssValue, lineHeight: 1, fontWeight: 700, whiteSpace: "nowrap" }}>Aa</Typography>
		: control.preview === "padding"
			? <Box sx={{ border: "1px solid", borderColor: "primary.main", borderRadius: 0.5, px: control.unit === "sp" ? 0.5 : cssValue, py: control.unit === "sp" ? theme.spacing(amount) : "0.15rem", color: "primary.main", fontSize: "0.65rem", lineHeight: 1 }}>Aa</Box>
			: <Box sx={{ width: control.preview === "height" ? 14 : control.preview === "square" ? shortSize : sampleSize, height: control.preview === "width" ? 10 : control.preview === "square" ? shortSize : sampleSize, maxWidth: "100%", maxHeight: "100%", borderRadius: 0.75, bgcolor: "primary.main", opacity: 0.78 }} />;

	return (
		<Box role="img" aria-label={`${label} example: ${value}`} sx={{ width: 68, height: 44, flexShrink: 0, display: "grid", placeItems: "center", overflow: "hidden", border: "1px solid", borderColor: "divider", borderRadius: 1.25, bgcolor: "action.hover" }}>
			{example}
		</Box>
	);
});

SizeExample.displayName = "SizeExample";

export default SizeExample;
