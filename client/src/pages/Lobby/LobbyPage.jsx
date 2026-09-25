import React from "react";
import { Box, Chip, CircularProgress, Grid, Paper, Stack, Typography, alpha, useScrollTrigger } from "@mui/material";
import { getCapacity, getTableNumber, normalizeStatus } from "./utils/normalize.js";
import TableCard from "./TableCard.jsx";
import { useSelector } from "react-redux";
import { Icon, Input, MenuItem, PageContainer, Select } from "@components";
import { useLang } from "@hooks";
import LobbySummeryCard from "./LobbySummeryCard.jsx";
import { TABLE_STATUS } from "../../../../constants/enumOptions.js";
import { useNavigate } from "react-router-dom";
const STATUS_FILTER = [{ label: "lobby.allStatus", value: "all" }];
TABLE_STATUS.forEach((st) => {
	STATUS_FILTER.push({ label: `lobby.${st}`, value: st });
});
const Filters = React.memo(({ tableName, setTableName, setStatus }) => {
	const elRef = React.useRef(null);
	const { t } = useLang();
	const [threshold, setThreshold] = React.useState(0);
	const scrolled = useScrollTrigger({
		disableHysteresis: true,
		threshold,
	});
	React.useLayoutEffect(() => {
		if (!elRef.current) return;
		setThreshold(elRef.current.getBoundingClientRect().bottom);
	}, []);
	return (
		<>
			<Stack
				ref={elRef}
				direction={"row"}
				spacing={2}
				sx={(theme) => ({
					position: "sticky",
					top: `${theme.layout["desktop-appbar-height"]}px`,
					// bgcolor: "background.default",
					backdropFilter: "blur(10px)",
					py: scrolled ? 1 : 0,
					zIndex: 10,
					transition: "padding 0.3s ease, backdrop-filter 0.3s ease",
				})}
			>
				<Input
					sx={{ bgcolor: "background.paper" }}
					name="status"
					placeholder={t("lobby.search")}
					value={tableName ?? ""}
					onChange={(e) => setTableName(e.target.value)}
					prefix={<Icon name="Search" />}
				/>
				<Select
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					sx={{ bgcolor: "background.paper", width: 180 }}
				>
					{STATUS_FILTER.map((st) => (
						<MenuItem key={st.value} value={st.value}>
							{t(st.label)}
						</MenuItem>
					))}
				</Select>
			</Stack>
		</>
	);
});
Filters.displayName = "Filters";
export const LobbyPage = () => {
	const { t } = useLang();
	const navigate = useNavigate();

	const { items, loading, connectionState } = useSelector((state) => state.tables);
	const [status, setStatus] = React.useState("all");
	const [tableName, setTableName] = React.useState(null);
	const tables = React.useMemo(() => {
		const result = [];
		const rgx = new RegExp(tableName, "i");

		for (const table of items) {
			if (status !== "all" && table.status !== status) continue;
			if (tableName && !rgx.test(table.table_number)) continue;
			result.push(table);
		}

		return result;
	}, [items, tableName, status]);
	const occupiedCount = React.useMemo(
		() => items.filter((table) => table?.status?.toLocaleLowerCase?.() === "occupied").length || 0,
		[items],
	);
	const availableCount = React.useMemo(
		() => items.filter((table) => table?.status?.toLocaleLowerCase?.() === "available").length || 0,
		[items],
	);
	const needsCleaningCount = React.useMemo(
		() => items.filter((table) => table?.status?.toLocaleLowerCase?.() === "needs_cleaning").length || 0,
		[items],
	);

	return (
		<PageContainer sx={{ gap: 2, height: "auto" }}>
			<Grid container spacing={2}>
				<Grid size={{ lg: 3, sm: 6, xs: 12 }}>
					<Stack
						direction={"column"}
						sx={(theme) => ({
							height: 130,
							background: theme.palette.primary.gradient,
							borderRadius: theme.shape.borderRadius + "px",
							color: "#fff",
							p: 1.5,
						})}
					>
						<Stack direction={"row"}>
							<Typography variant="h6">Total orders</Typography>
							<Icon name="TableBarTwoTone" size="2.5rem" sx={{ marginInlineStart: "auto" }} />
						</Stack>
						<Typography variant="h6" sx={{ mt: "auto" }}>
							----
						</Typography>
					</Stack>
				</Grid>
				<Grid size={{ lg: 3, sm: 6, xs: 12 }}>
					<LobbySummeryCard type="occupied" label={t("lobby.Occupied")} number={occupiedCount} />
				</Grid>
				<Grid size={{ lg: 3, sm: 6, xs: 12 }}>
					<LobbySummeryCard type="ready" label={t("lobby.Available")} number={availableCount} />
				</Grid>
				<Grid size={{ lg: 3, sm: 6, xs: 12 }}>
					<LobbySummeryCard type="preparing" label={t("lobby.Needs_Cleaning")} number={needsCleaningCount} />
				</Grid>
			</Grid>

			<Filters tableName={tableName} setTableName={setTableName} setStatus={setStatus} />
			{loading ? (
				<Paper
					sx={{
						p: 4,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						minHeight: 220,
						flex: 1,
						overflow: "auto",
						background: (theme) => alpha(theme.palette.primary.main, 0.08),
					}}
				>
					<Stack sx={{ alignItems: "center" }} spacing={2}>
						<CircularProgress size={32} />
						<Typography variant="body">Loading tables…</Typography>
					</Stack>
				</Paper>
			) : (
				<Grid container spacing={2}>
					{tables.map((table) => {
						return (
							<Grid key={table?.id ?? getTableNumber(table)} size={{ lg: 3, md: 4, sm: 6, xs: 12 }}>
								<TableCard item={table} onSelect={(selectedTable) => navigate(`/customer-menu/${selectedTable.id}`)} />
							</Grid>
						);
					})}
				</Grid>
			)}
		</PageContainer>
	);
};

export default LobbyPage;
