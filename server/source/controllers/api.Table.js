import { mdlTable } from "../../../constants/modelNames.js";
import { Api_Table } from "../../../constants/SubApi.js";
import { St_BAD_REQUEST, St_CREATED, St_OK, St_NOT_FOUND } from "../../../constants/HttpStatus.js";

export const subapi = Api_Table;

export const getAll = async (req, res, params) => {
	try {
		const { [mdlTable]: Table } = req.app.locals.db;
		const tables = await Table.findAll({
			order: [["table_number", "ASC"]],
		});
		res.status(St_OK).json({ success: true, data: tables });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, error: err.message });
	}
};

export const post = async (req, res) => {
	try {
		const { [mdlTable]: Table } = req.app.locals.db;
		const data = req.body;
		const newTable = await Table.create(data);
		res.status(St_CREATED).json({ success: true, data: newTable });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, error: err.message });
	}
};

export const patch = async (req, res) => {
	try {
		const { [mdlTable]: Table } = req.app.locals.db;
		const { id, status, capacity } = req.body;

		const table = await Table.findByPk(id);
		if (!table) return res.status(St_NOT_FOUND).json({ success: false, error: "Table not found" });

		if (status) table.status = status;
		if (capacity) table.capacity = capacity;

		await table.save();

		res.status(St_OK).json({ success: true, data: table, message: "Table updated successfully" });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, error: err.message });
	}
};
