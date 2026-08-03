import express from "express";
import { createServer } from "http"; // إضافة
import { Server } from "socket.io"; // إضافة
import registerAPIs from "./controllers/apiRegister.js";
import assignContext from "./authentication/context.js";
import connect from "./models/db.js";
import cors from "cors";
import path from "path";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: { origin: "*" },
});

app.use(express.json());
app.use(cors());

app.locals.io = io;

if (process.env.NODE_ENV === "development") {
	app.use(express.static(path.join(process.cwd(), "../public")));
}

io.on("connection", (socket) => {
	console.log("User connected to socket:", socket.id);

	socket.on("join_board", (boardId) => {
		socket.join(`board_${boardId}`);
		console.log(`Socket ${socket.id} joined board_${boardId}`);
	});

	socket.on("leave_board", (boardId) => {
		socket.leave(`board_${boardId}`);
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});

const startServer = async () => {
	try {
		app.locals.db = await connect();
		app.use(assignContext);
		registerAPIs(app);
		httpServer.listen(process.env.APP_PORT || 3001, () => {
			console.log(`Server running on http://localhost:${process.env.APP_PORT || 3001}`);
		});
	} catch (err) {
		console.error("DB connection failed:", err);
	}
};

startServer();
