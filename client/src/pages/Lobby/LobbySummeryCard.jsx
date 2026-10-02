import React from "react";
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";

const SUMMARY_STYLES = {
	total: { icon: TableRestaurantIcon, color: "primary.main", tint: "primary" },
	occupied: { icon: PeopleAltIcon, color: "tableStatus.occupied", tint: "error" },
	ready: { icon: CheckCircleOutlineIcon, color: "tableStatus.ready", tint: "success" },
	preparing: { icon: CleaningServicesIcon, color: "tableStatus.preparing", tint: "warning" },
};

export const LobbySummeryCard = React.memo(({ type = "total", label, number }) => {
	const theme = useTheme();
	const style = SUMMARY_STYLES[type] ?? SUMMARY_STYLES.total;
	const SummaryIcon = style.icon;
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
				<SummaryIcon sx={{ fontSize: "1.5rem" }} />
			</Box>
		</Paper>
	);
});

LobbySummeryCard.displayName = "LobbySummeryCard";
export default LobbySummeryCard;
