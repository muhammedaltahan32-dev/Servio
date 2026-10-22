import React from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useLang } from "@hooks";
import { useReducedMotion } from "framer-motion";

export const PageLoadingFallback = () => {
	const { t } = useLang();
	const prefersReducedMotion = useReducedMotion();

	return (
		<Box
			role="status"
			aria-label={t("loading.page")}
			sx={{ minHeight: { xs: 240, md: 320 }, display: "grid", placeItems: "center", width: "100%" }}
		>
			<Stack spacing={1.5} sx={{ alignItems: "center" }}>
				<CircularProgress
					size={32}
					thickness={3.5}
					variant={prefersReducedMotion ? "determinate" : "indeterminate"}
					value={prefersReducedMotion ? 72 : undefined}
					aria-hidden="true"
				/>
				<Typography variant="body2" color="text.secondary" fontWeight={500}>
					{t("loading.title")}
				</Typography>
			</Stack>
		</Box>
	);
};

export default PageLoadingFallback;
