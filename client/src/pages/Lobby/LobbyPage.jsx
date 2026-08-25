import React, { useEffect, useState } from "react";
import { Box, Chip, CircularProgress, Paper, Stack, Typography, alpha } from "@mui/material";
import { io } from "socket.io-client";
import RestaurantTable from "../../components/RoundTableChairs/RoundTableChairs.jsx";

const normalizeStatus = (status) => {
	if (!status) return "new";

	const normalized = String(status).trim().toLowerCase().replace(/_/g, "").replace(/\s+/g, "");

	if (normalized.includes("available")) return "ready";
	if (normalized.includes("occupied")) return "reserved";
	if (normalized.includes("clean")) return "preparing";
	if (normalized.includes("delay")) return "delayed";

	return "new";
};

const getTableNumber = (table) => table?.table_number ?? table?.number ?? table?.id ?? "--";
const getCapacity = (table) => Number(table?.capacity ?? table?.chairsCount ?? 4) || 4;

export const LobbyPage = () => {
	const [tables, setTables] = useState([]);
	const [loading, setLoading] = useState(true);
	const [connectionState, setConnectionState] = useState("connecting");

	useEffect(() => {
		const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001", {
			transports: ["polling", "websocket"],
			reconnectionAttempts: 5,
		});

		socket.on("connect", () => {
			setConnectionState("live");
			socket.emit("tables:request");
		});

		socket.on("disconnect", () => {
			setConnectionState("offline");
		});

		socket.on("tables:updated", (payload) => {
			const nextTables = Array.isArray(payload) ? payload : (payload?.data ?? payload?.tables ?? []);
			setTables(nextTables);
			setLoading(false);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<Box sx={{ p: 3 }}>
			<Stack
				direction="row"
				sx={{
					mb: 3,
					gap: 2,
					flexWrap: "wrap",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Box>
					<Typography variant="h4" sx={{ fontWeight: 700 }}>
						Tables Lobby
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Live status updates using Socket.IO
					</Typography>
				</Box>
				<Chip
					label={connectionState === "live" ? "Live" : connectionState === "offline" ? "Offline" : "Connecting"}
					color={connectionState === "live" ? "success" : connectionState === "offline" ? "error" : "warning"}
					variant="filled"
				/>
			</Stack>

			{loading ? (
				<Paper
					sx={{
						p: 4,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						minHeight: 220,
						background: (theme) => alpha(theme.palette.primary.main, 0.08),
					}}
				>
					<Stack sx={{ alignItems: "center" }} spacing={2}>
						<CircularProgress size={32} />
						<Typography variant="body1">Loading tables…</Typography>
					</Stack>
				</Paper>
			) : (
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
					{tables.map((table) => {
						const status = normalizeStatus(table?.status);
						return (
							<Paper
								key={table?.id ?? getTableNumber(table)}
								elevation={3}
								sx={{
									p: 2.5,
									minWidth: 220,
									border: "1px solid",
									borderColor: "divider",
									backgroundColor: "background.paper",
								}}
							>
								<Stack spacing={1.5} sx={{ alignItems: "center" }}>
									<RestaurantTable
										number={String(getTableNumber(table))}
										chairsCount={Math.max(2, getCapacity(table))}
										tableSize={92}
										status={status}
									/>
									<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
										Table {getTableNumber(table)}
									</Typography>
									<Stack
										direction="row"
										spacing={1}
										sx={{
											flexWrap: "wrap",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Chip
											label={table?.status ?? "new"}
											color={
												status === "ready"
													? "success"
													: status === "reserved"
														? "secondary"
														: status === "preparing"
															? "warning"
															: "primary"
											}
											size="small"
										/>
										<Chip label={`${getCapacity(table)} seats`} variant="outlined" size="small" />
									</Stack>
								</Stack>
							</Paper>
						);
					})}
				</Box>
			)}
		</Box>
	);
};

export default LobbyPage;
