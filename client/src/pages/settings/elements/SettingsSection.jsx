import React from "react";
import { Box, Typography } from "@mui/material";

const SettingsSection = ({ title, children, sx }) => (
	<Box component="section" sx={{ py: 2.5, borderBottom: "1px solid", borderColor: "divider", ...sx }}>
		{title && <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.25 }}>{title}</Typography>}
		{children}
	</Box>
);

export default SettingsSection;
