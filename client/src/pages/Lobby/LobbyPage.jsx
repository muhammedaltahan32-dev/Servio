import React from "react";
import { Box, Chip, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Icon, Input, MenuItem, PageContainer, Select } from "@components";
import { useLang } from "@hooks";
import { TABLE_STATUS } from "../../../../constants/enumOptions.js";
import { getTableNumber } from "./utils/normalize.js";
import LobbySummeryCard from "./LobbySummeryCard.jsx";
import TableCard from "./TableCard.jsx";

const STATUS_FILTER = [
	{ label: "lobby.allStatus", value: "all" },
	...TABLE_STATUS.map((status) => ({ label: `lobby.${status}`, value: status })),
];

const Filters = React.memo(({ tableName, setTableName, status, setStatus }) => {
	const { t } = useLang();
	return (
		<Paper
			variant="outlined"
			component="section"
			aria-label={t("lobby.search")}
			sx={(theme) => ({
				p: { xs: 1.25, sm: 1.5 },
				mb: 2,
				width: { xs: "100%", sm: 420 },
				maxWidth: "100%",
				borderColor: "divider",
				borderRadius: `${theme.tokens.radius.panel}px`,
				bgcolor: "background.paper",
			})}
		>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ minWidth: 0 }}>
				<Input
					fullWidth
					name="table-search"
					placeholder={t("lobby.search")}
					value={tableName}
					onChange={(event) => setTableName(event.target.value)}
					prefix={<Icon name="Search" color="text.secondary" />}
				/>
				<Select
					value={status}
					onChange={(event) => setStatus(event.target.value)}
					sx={{ width: { xs: "100%", sm: 210 }, flexShrink: 0, bgcolor: "background.paper" }}
				>
					{STATUS_FILTER.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{t(option.label)}
						</MenuItem>
					))}
				</Select>
			</Stack>
		</Paper>
	);
});

Filters.displayName = "LobbyFilters";

export const LobbyPage = () => {
	const { t } = useLang();
	const navigate = useNavigate();
	const { items = [], loading, connectionState } = useSelector((state) => state.tables);
	const [status, setStatus] = React.useState("all");
	const [tableName, setTableName] = React.useState("");

	const tables = React.useMemo(() => {
		const query = tableName.trim().toLocaleLowerCase();
		return items.filter((table) => {
			const matchesStatus = status === "all" || String(table?.status).toLowerCase() === status.toLowerCase();
			const matchesName = !query || String(getTableNumber(table)).toLocaleLowerCase().includes(query);
			return matchesStatus && matchesName;
		});
	}, [items, status, tableName]);
	const occupiedCount = items.filter((table) => String(table?.status).toLowerCase() === "occupied").length;
	const availableCount = items.filter((table) => String(table?.status).toLowerCase() === "available").length;
	const needsCleaningCount = items.filter((table) => String(table?.status).toLowerCase() === "needs_cleaning").length;

	return (
		<PageContainer
			sx={(theme) => ({ gap: theme.tokens.space.section, height: "auto", minHeight: `calc(100dvh - ${theme.tokens.size.appBarHeight}px)`, minWidth: 0, overflowX: "hidden" })}
		>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				sx={{
					alignItems: { xs: "stretch", sm: "center" },
					justifyContent: "space-between",
					gap: 1.5,
				}}
			>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
						{t("lobby.title")}
					</Typography>
					<Typography color="text.secondary">{t("lobby.subtitle")}</Typography>
				</Box>
				<Chip
					label={
						connectionState === "live"
							? t("lobby.liveUpdates")
							: connectionState === "offline"
								? t("lobby.offline")
								: t("lobby.connecting")
					}
					color={connectionState === "live" ? "success" : connectionState === "offline" ? "error" : "default"}
					variant="outlined"
					sx={{ alignSelf: { xs: "flex-start", sm: "center" }, fontWeight: 700 }}
				/>
			</Stack>

			<Grid container spacing={1.5}>
				<Grid size={{ xs: 6, sm: 6, lg: 3 }}>
					<LobbySummeryCard type="total" label={t("lobby.totalTables")} number={items.length} />
				</Grid>
				<Grid size={{ xs: 6, sm: 6, lg: 3 }}>
					<LobbySummeryCard type="occupied" label={t("lobby.Occupied")} number={occupiedCount} />
				</Grid>
				<Grid size={{ xs: 6, sm: 6, lg: 3 }}>
					<LobbySummeryCard type="ready" label={t("lobby.Available")} number={availableCount} />
				</Grid>
				<Grid size={{ xs: 6, sm: 6, lg: 3 }}>
					<LobbySummeryCard type="preparing" label={t("lobby.Needs_Cleaning")} number={needsCleaningCount} />
				</Grid>
			</Grid>

			<Box sx={{ minWidth: 0 }}>
				<Stack
					direction={{ xs: "column", sm: "row" }}
					sx={{ mb: 1.25, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", gap: 1.25 }}
				>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 800 }}>
							{t("lobby.allTables")}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t("lobby.tableCount", { visible: tables.length, total: items.length })}
						</Typography>
					</Box>
					<Filters tableName={tableName} setTableName={setTableName} status={status} setStatus={setStatus} />
				</Stack>
				{loading ? (
					<Paper
						variant="outlined"
						sx={{
							minHeight: 230,
							display: "grid",
							placeItems: "center",
							borderRadius: 2.5,
							bgcolor: "background.paper",
						}}
					>
						<Stack sx={{ alignItems: "center" }} spacing={1.5}>
							<CircularProgress size={30} />
							<Typography color="text.secondary">{t("lobby.loadingTables")}</Typography>
						</Stack>
					</Paper>
				) : tables.length ? (
					<Grid container spacing={1.5}>
						{tables.map((table) => (
							<Grid key={table?.id ?? getTableNumber(table)} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
								<TableCard item={table} onSelect={(selectedTable) => navigate(`/customer-menu/${selectedTable.id}`)} />
							</Grid>
						))}
					</Grid>
				) : (
					<Paper
						variant="outlined"
						sx={{
							p: { xs: 3, sm: 5 },
							minHeight: 220,
							display: "grid",
							placeItems: "center",
							textAlign: "center",
							borderRadius: 2.5,
							bgcolor: "background.paper",
						}}
					>
						<Stack sx={{ alignItems: "center" }} spacing={1}>
							<Icon name="TableBar" size="2rem" color="text.secondary" />
							<Typography variant="h6" sx={{ fontWeight: 700 }}>
								{t("lobby.emptyTitle")}
							</Typography>
							<Typography color="text.secondary">{t("lobby.emptyDescription")}</Typography>
						</Stack>
					</Paper>
				)}
			</Box>
		</PageContainer>
	);
};

export default LobbyPage;

