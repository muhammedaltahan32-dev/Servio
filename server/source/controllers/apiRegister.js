import * as Architecture from "./authentication/api.Architecture.js";
import * as Signin from "./authentication/api.Signin.js";
import * as User from "./api.User.js";
import * as Upload from "./api.Upload.js";
import * as Category from "./api.Category.js";
import * as MenuItem from "./api.MenuItem.js";
import * as Order from "./api.Order.js";
import * as Table from "./api.Table.js";
import * as Payment from "./api.Payment.js";

import { St_FORBIDDEN, St_INTERNAL_SERVER_ERROR, St_NOT_FOUND } from "../../../constants/HttpStatus.js";

const controllers = [Signin, Architecture, User, Upload, Category, MenuItem, Order, Table, Payment];

const permissionCheck = (method, resourceName, action) => async (req, res) => {
	try {
		if (!req.context) {
			return res.status(St_FORBIDDEN).json({ message: "messages.error.noContext" });
		}

		if (!req.context.hasPermission(resourceName, action)) {
			return res.status(St_FORBIDDEN).json({ message: "messages.error.Accessdenied" });
		}

		await method(req, res);
	} catch (error) {
		console.error(error);
		res.status(St_INTERNAL_SERVER_ERROR).json({ message: "error.messages.serverError" });
	}
};

const handleGetOne = (method, resourceName) => async (req, res) => {
	const id = req.params.id;
	if (!id) return res.status(St_NOT_FOUND).json({ message: "messages.error.IDNotProvided" });
	await permissionCheck(async () => method(id, req, res), resourceName, "getOne")(req, res);
};

const handleGetSlice = (method, resourceName) => async (req, res) => {
	const { offset, limit, filter } = req.query;
	const parsedOffset = parseInt(offset) || 0;
	const parsedLimit = parseInt(limit) || 10;
	const params = { parsedOffset, parsedLimit, filter };
	await permissionCheck(() => method(params, req, res), resourceName, "getSlice")(req, res);
};

const handleGetAll = (method, resourceName) => async (req, res) => {
	const params = req.query;
	await permissionCheck(() => method(req, res, params), resourceName, "getAll")(req, res);
};

export default function registerAPIs(app) {
	controllers.forEach((api) => {
		if (!api.subapi) throw new Error("subapi is not defined");

		const basePath = `/${api.subapi}`;

		if (typeof api.register === "function") {
			api.register(app);
		}

		if (typeof api.getSlice === "function") {
			app.get(`${basePath}/slice`, handleGetSlice(api.getSlice, api.subapi));
		}

		if (typeof api.getAll === "function") {
			app.get(`${basePath}/all`, handleGetAll(api.getAll, api.subapi));
		}

		if (typeof api.getOne === "function") {
			app.get(`${basePath}/:id`, handleGetOne(api.getOne, api.subapi));
		}

		if (typeof api.get === "function") {
			app.get(`${basePath}`, permissionCheck(api.get, api.subapi, "get"));
		}

		if (typeof api.post === "function") {
			app.post(`${basePath}`, permissionCheck(api.post, api.subapi, "post"));
		}

		if (typeof api.put === "function") {
			app.put(`${basePath}`, permissionCheck(api.put, api.subapi, "put"));
		}

		if (typeof api.remove === "function") {
			app.delete(`${basePath}/:id`, permissionCheck(api.remove, api.subapi, "remove"));
		}

		if (typeof api.patch === "function") {
			app.patch(`${basePath}`, permissionCheck(api.patch, api.subapi, "patch"));
		}
	});
}

