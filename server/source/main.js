import express from "express";

const app = express();

const startServer = async () => {
	try {
		app.listen(process.env.APP_PORT || 3001, () => {
			console.log(`Server running on http://localhost:${process.env.APP_PORT || 3001}`);
		});
	} catch (err) {
		console.error("DB connection failed:", err);
	}
};

startServer();
