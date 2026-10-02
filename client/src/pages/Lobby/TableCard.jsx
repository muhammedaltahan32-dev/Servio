import React from "react";
import { Box, Chip, Paper, Stack, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getCapacity, getTableNumber, normalizeStatus, getTableSizeType } from "./utils/normalize.js";
import { RestaurantTable } from "@components";
import { useLang } from "@hooks";

export const TableCard = React.memo(({ item, onSelect }) => {
	const tableNumber = getTableNumber(item);
	const status = normalizeStatus(item?.status);
	const capacity = getCapacity(item);
	const { t } = useLang();
	const theme = useTheme();
	const tableSizeType = getTableSizeType(capacity);
	const isAvailable = String(item?.status).toLowerCase() === "available";
	const statusColor = theme.palette.tableStatus[status] ?? theme.palette.primary.main;

	return (
		<Paper
			component="button"
			type="button"
			disabled={!isAvailable}
			aria-label={t("lobby.tableAria", { status: t(`lobby.${item?.status}`), number: tableNumber })}
			onClick={() => onSelect?.(item)}
			variant="outlined"
			sx={{
				p: 1.75,
			minHeight: theme.tokens.size.tableCardMinHeight,
				width: "100%",
				minWidth: 0,
				textAlign: "start",
				font: "inherit",
				color: "text.primary",
				bgcolor: "background.paper",
				borderColor: "divider",
			borderRadius: `${theme.tokens.radius.panel}px`,
			boxShadow: theme.tokens.shadow.card,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				cursor: isAvailable ? "pointer" : "default",
				transition: `transform ${theme.tokens.motion.fast}, box-shadow ${theme.tokens.motion.fast}, border-color ${theme.tokens.motion.fast}`,
				"&:hover": isAvailable ? { transform: "translateY(-3px)", borderColor: "primary.main", boxShadow: theme.tokens.shadow.cardHover } : {},
				"&:focus-visible": { outline: `3px solid ${theme.palette.primary.main}55`, outlineOffset: 2 },
				"&:disabled": { opacity: 0.82 },
			}}
		>
			<Stack direction="row" gap={1} sx={{ width: "100%", minWidth: 0, alignItems: "center", justifyContent: "space-between" }}>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1.2 }}>{t("lobby.tableLabel")}</Typography>
					<Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3 }} noWrap>#{tableNumber}</Typography>
				</Box>
				<Chip
					label={t(`lobby.${item?.status}`)}
					size="small"
					sx={{ bgcolor: `color-mix(in srgb, ${statusColor} 13%, transparent)`, color: statusColor, fontWeight: 700, borderRadius: 1.25 }}
				/>
			</Stack>
			<Stack direction="row" gap={1} sx={{ width: "100%", mt: 0.75, alignItems: "center", justifyContent: "space-between" }}>
				<RestaurantTable
					number={String(tableNumber)}
					chairsCount={capacity}
					tableSize={43}
					chairColor={statusColor}
					tableBgColor={`color-mix(in srgb, ${statusColor} 14%, transparent)`}
					tableBorderColor={statusColor}
				/>
				<Stack spacing={0.5} sx={{ minWidth: 0, alignItems: "flex-end" }}>
					<Typography variant="body2" sx={{ fontWeight: 700 }}>{capacity} {t("lobby.persons")}</Typography>
					<Typography variant="caption" color="text.secondary">{t("lobby.tableType", { type: t(`lobby.${tableSizeType}`) })}</Typography>
					<Stack direction="row" spacing={0.5} sx={{ color: isAvailable ? "primary.main" : "text.disabled", mt: 0.25, alignItems: "center" }}>
						<Typography variant="caption" sx={{ fontWeight: 700 }}>{isAvailable ? t("lobby.openMenu") : t("lobby.unavailable")}</Typography>
						{isAvailable && (theme.direction === "rtl" ? <ArrowBackIcon sx={{ fontSize: "0.9rem" }} /> : <ArrowForwardIcon sx={{ fontSize: "0.9rem" }} />)}
					</Stack>
				</Stack>
			</Stack>
		</Paper>
	);
});

TableCard.displayName = "TableCard";
export default TableCard;
