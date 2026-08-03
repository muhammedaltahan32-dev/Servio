import { Sequelize, DataTypes } from "sequelize";
import systemRecords from "./systemRecords.js";

const dbModels = [import("./mdl.User.js")];

const connect = async () => {
	const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
		host: process.env.DB_SERVER,
		dialect: process.env.DB_DIALECT,
		port: process.env.DB_PORT,
		logging: false,
		define: {
			charset: "utf8mb4",
			collate: "utf8mb4_unicode_ci",
		},
		dialectOptions: {
			charset: "utf8mb4",
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	});

	const models = { sequelize };
	const relations = [];

	const modules = await Promise.all(dbModels);

	for (const mod of modules) {
		const defineFunc = mod.default;
		if (!defineFunc || typeof defineFunc !== "function") {
			throw new Error("There is no defineFunc");
		}

		const [name, model, defineRelation] = defineFunc(sequelize, DataTypes);

		if (!name || !model) {
			throw new Error("name or model is not defined");
		}

		if (models[name]) {
			throw new Error(`Model ${name} was already organized`);
		}

		models[name] = model;

		if (defineRelation) {
			if (typeof defineRelation !== "function") throw new Error("defineRelation is not a function");
			relations.push(defineRelation);
		}
	}

	await Promise.all(relations.map((fn) => fn(models)));

	await sequelize.authenticate();
	if (process.env.DB_SYNC === "true") {
		await sequelize.sync({ alter: true });
		await systemRecords(models);
	}

	return models;
};

export default connect;
