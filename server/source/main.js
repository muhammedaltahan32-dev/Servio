import express from "express";
import registerAPIs from "./controllers/apiRegister.js";
import assignContext from "./authentication/context.js";
import connect from "./models/db.js";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
	app.use(express.static(path.join(process.cwd(), "../public")));
}

const startServer = async () => {
	try {
		app.locals.db = await connect();
		app.use(assignContext);
		registerAPIs(app);
		app.listen(process.env.APP_PORT || 3001, () => {
			console.log(`Server running on http://localhost:${process.env.APP_PORT || 3001}`);
		});
	} catch (err) {
		console.error("DB connection failed:", err);
	}
};

startServer();

