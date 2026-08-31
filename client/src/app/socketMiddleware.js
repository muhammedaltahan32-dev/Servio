import { createListenerMiddleware } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { setTables, setConnectionState } from "../features/tables/TablesSlice.js";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
	type: "socket/init",
	effect: async (action, listenerApi) => {
		const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001", {
			transports: ["polling", "websocket"],
			reconnectionAttempts: 5,
		});

		socket.on("connect", () => {
			listenerApi.dispatch(setConnectionState("live"));
			socket.emit("tables:request");
		});

		socket.on("disconnect", () => {
			listenerApi.dispatch(setConnectionState("offline"));
		});

		socket.on("tables:updated", (payload) => {
			const nextTables = Array.isArray(payload) ? payload : (payload?.data ?? payload?.tables ?? []);
			// dispatch(setTables(nextTables));

			listenerApi.dispatch(setTables(nextTables));
		});

		await listenerApi.condition(() => false);
	},
});
