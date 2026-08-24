import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import connect from "./models/db.js";
import registerAPIs from "./controllers/apiRegister.js";
import assignContext from "./authentication/context.js";
import { mdlTable } from "../../constants/modelNames.js";
import { Table_Number } from "../../constants/FieldsName.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
	app.use(express.static(path.join(process.cwd(), "../public")));
}

app.locals.io = io;

app.use(assignContext);
registerAPIs(app);

io.on("connection", (socket) => {
	console.log(`Client connected: ${socket.id}`);

	socket.on("tables:request", async () => {
		try {
			const db = app.locals.db;
			if (!db) return;

			const Table = db[mdlTable];
			if (!Table) {
				console.error(`Model '${mdlTable}' not found in app.locals.db`);
				return;
			}

			const tables = await Table.findAll({
				order: [[Table_Number, "ASC"]],
			});

			socket.emit("tables:updated", tables);
		} catch (err) {
			console.error("Failed to fetch tables on socket request:", err.message);
		}
	});

	socket.on("disconnect", () => {
		console.log(`Client disconnected: ${socket.id}`);
	});
});

const startServer = async () => {
	try {
		app.locals.db = await connect();
		const PORT = process.env.APP_PORT || 3001;

		server.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error("DB connection failed:", err);
		process.exit(1);
	}
};

startServer();
