import React from "react";
import { Box, Chip, Paper, Stack, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getCapacity, getTableNumber, normalizeStatus, getTableSizeType } from "./utils/normalize.js";
import { Button, RestaurantTable } from "@components";
import { useLang } from "@hooks";
import { ST_AVAILABLE, ST_NEEDS_CLEANING, ST_OCCUPIED } from "../../../../constants/enumOptions.js";

export const TableCard = React.memo(({ item, onSelect, onStatusChange, updating = false }) => {
	const tableNumber = getTableNumber(item);
	const status = normalizeStatus(item?.status);
	const capacity = getCapacity(item);
	const { t } = useLang();
	const theme = useTheme();
	const tableSizeType = getTableSizeType(capacity);
	const currentStatus = String(item?.status).toLowerCase();
	const isAvailable = currentStatus === ST_AVAILABLE.toLowerCase();
	const nextStatus = currentStatus === ST_OCCUPIED.toLowerCase()
		? ST_NEEDS_CLEANING
		: currentStatus === ST_NEEDS_CLEANING.toLowerCase()
			? ST_AVAILABLE
			: null;
	const statusColor = theme.palette.tableStatus[status] ?? theme.palette.primary.main;

	return (
		<Paper
			component="article"
			aria-label={t("lobby.tableAria", { status: t(`lobby.${item?.status}`), number: tableNumber })}
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
				transition: `transform ${theme.tokens.motion.fast}, box-shadow ${theme.tokens.motion.fast}, border-color ${theme.tokens.motion.fast}`,
				"&:hover": { borderColor: "divider", boxShadow: theme.tokens.shadow.card },
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
				</Stack>
			</Stack>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: "100%", mt: 1.5 }}>
				{isAvailable && (
					<Button fullWidth size="small" variant="outlined" onClick={() => onSelect?.(item)}>
						{t("lobby.openMenu")}
						{theme.direction === "rtl" ? <ArrowBackIcon sx={{ ml: 0.5, fontSize: "0.9rem" }} /> : <ArrowForwardIcon sx={{ ml: 0.5, fontSize: "0.9rem" }} />}
					</Button>
				)}
				{nextStatus && (
					<Button fullWidth size="small" variant={isAvailable ? "text" : "outlined"} loading={updating} disabled={updating} onClick={() => onStatusChange?.(item)}>
						{nextStatus === ST_NEEDS_CLEANING
							? t("tables.action.Needs_Cleaning", { defaultValue: "Mark for cleaning" })
							: t("tables.action.Available", { defaultValue: "Mark available" })}
					</Button>
				)}
			</Stack>
		</Paper>
	);
});

TableCard.displayName = "TableCard";
export default TableCard;
