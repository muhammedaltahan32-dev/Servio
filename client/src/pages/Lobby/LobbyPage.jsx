import React, { useEffect, useState } from "react";
import { Box, Chip, CircularProgress, Grid, Paper, Stack, Typography, alpha } from "@mui/material";
import { io } from "socket.io-client";
import { getCapacity, getTableNumber, normalizeStatus } from "./utils/normalize.js";
import TableCard from "./TableCard.jsx";
import { useSelector } from "react-redux";
import { Icon, Input, MenuItem, PageContainer, Select } from "@components";
import { useLang } from "@hooks";
import LobbySummeryCard from "./LobbySummeryCard.jsx";

export const LobbyPage = () => {
	const { t } = useLang();
	// const [tables, setTables] = useState([]);
	// const [loading, setLoading] = useState(true);
	// const [connectionState, setConnectionState] = useState("connecting");
	const { items: tables, loading, connectionState } = useSelector((state) => state.tables);
	// useEffect(() => {
	// 	const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001", {
	// 		transports: ["polling", "websocket"],
	// 		reconnectionAttempts: 5,
	// 	});

	// 	socket.on("connect", () => {
	// 		setConnectionState("live");
	// 		socket.emit("tables:request");
	// 	});

	// 	socket.on("disconnect", () => {
	// 		setConnectionState("offline");
	// 	});

	// 	socket.on("tables:updated", (payload) => {
	// 		const nextTables = Array.isArray(payload) ? payload : (payload?.data ?? payload?.tables ?? []);
	// 		setTables(nextTables);
	// 		setLoading(false);
	// 	});

	// 	return () => {
	// 		socket.disconnect();
	// 	};
	// }, []);

	return (
		<PageContainer sx={{ gap: 2, overflow: "auto" }}>
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
							12
						</Typography>
					</Stack>
				</Grid>
				<Grid size={{ lg: 3, sm: 6, xs: 12 }}>
					<LobbySummeryCard type="occupied" label={t("lobby.Occupied")} number="5" />
				</Grid>
				<Grid size={{ lg: 3, sm: 6, xs: 12 }}>
					<LobbySummeryCard type="ready" label={t("lobby.Available")} number="5" />
				</Grid>
				<Grid size={{ lg: 3, sm: 6, xs: 12 }}>
					<LobbySummeryCard type="preparing" label={t("lobby.Needs_Cleaning")} number="5" />
				</Grid>
			</Grid>

			<Stack direction={"row"} spacing={2}>
				<Input sx={{ bgcolor: "background.paper" }} placeholder="search..." prefix={<Icon name="Search" />} />
				<Select value="all" sx={{ bgcolor: "background.paper" }}>
					<MenuItem value={"all"}>All status</MenuItem>
				</Select>
			</Stack>
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
								<TableCard item={table} />
							</Grid>
						);
					})}
				</Grid>
			)}
		</PageContainer>
	);
};

export default LobbyPage;
