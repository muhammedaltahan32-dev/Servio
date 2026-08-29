import React, { useEffect, useState } from "react";
import { Box, Chip, CircularProgress, Paper, Stack, Typography, alpha } from "@mui/material";
import { io } from "socket.io-client";
import { getCapacity, getTableNumber, normalizeStatus } from "./utils/normalize.js";
import TableCard from "./TableCard.jsx";
import { useSelector } from "react-redux";

export const LobbyPage = () => {
	// const [tables, setTables] = useState([]);
	// const [loading, setLoading] = useState(true);
	// const [connectionState, setConnectionState] = useState("connecting");
const {items : tables,loading,connectionState} = useSelector((state)=>state.tables)
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
						return <TableCard key={table?.id ?? getTableNumber(table)} item={table} />;
					})}
				</Box>
			)}
		</Box>
	);
};

export default LobbyPage;
