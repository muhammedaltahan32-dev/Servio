import React from "react";
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { Icon } from "@components";

const SUMMARY_STYLES = {
	total: { icon: "TableRestaurant", color: "primary.main", tint: "primary" },
	occupied: { icon: "PeopleAlt", color: "tableStatus.occupied", tint: "error" },
	ready: { icon: "CheckCircleOutline", color: "tableStatus.ready", tint: "success" },
	preparing: { icon: "CleaningServices", color: "tableStatus.preparing", tint: "warning" },
};

export const LobbySummeryCard = ({ type = "total", label, number }) => {
	const theme = useTheme();
	const style = SUMMARY_STYLES[type] ?? SUMMARY_STYLES.total;
	return (
		<Paper
			variant="outlined"
			sx={{
				p: theme.tokens.space.section,
				minWidth: 0,
				minHeight: theme.tokens.size.summaryCardMinHeight,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 1.5,
				borderColor: "divider",
				borderRadius: `${theme.tokens.radius.panel}px`,
				bgcolor: "background.paper",
				boxShadow: theme.tokens.shadow.card,
			}}
		>
			<Stack spacing={0.5} sx={{ minWidth: 0 }}>
				<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }} noWrap>
					{label}
				</Typography>
				<Typography variant="h4" sx={{ fontWeight: 800, color: style.color, lineHeight: 1.1 }}>
					{number}
				</Typography>
			</Stack>
			<Box sx={{ display: "grid", placeItems: "center", width: 48, height: 48, flexShrink: 0, borderRadius: `${theme.tokens.radius.card}px`, bgcolor: `${style.tint}.light`, color: style.color }}>
				<Icon name={style.icon} size="1.5rem" />
			</Box>
		</Paper>
	);
};

export default LobbySummeryCard;
