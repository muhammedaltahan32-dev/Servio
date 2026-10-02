import React from "react";
import { Box, CircularProgress } from "@mui/material";

export const PageLoadingFallback = () => (
	<Box role="status" aria-label="Loading page" sx={{ minHeight: 180, display: "grid", placeItems: "center" }}>
		<CircularProgress size={28} />
	</Box>
);

export default PageLoadingFallback;
