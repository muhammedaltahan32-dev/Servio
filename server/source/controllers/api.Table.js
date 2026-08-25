import { mdlTable } from "../../../constants/modelNames.js";
import { Api_Table } from "../../../constants/SubApi.js";
import {
	St_BAD_REQUEST,
	St_CREATED,
	St_OK,
	St_NOT_FOUND,
	St_INTERNAL_SERVER_ERROR,
} from "../../../constants/HttpStatus.js";
import { Table_ID, Table_Number, Table_Status, Table_Capacity } from "../../../constants/FieldsName.js";
import { Op } from "sequelize";

export const subapi = Api_Table;

const emitTablesUpdate = async (req) => {
	const io = req.app.locals.io;
	const db = req.app.locals.db;

	if (!io || !db) return;

	const { [mdlTable]: Table } = db;
	if (!Table) return;

	const tables = await Table.findAll({
		order: [[Table_Number, "ASC"]],
	});

	io.emit("tables:updated", tables);
};

export const getAll = async (req, res) => {
	try {
		const { [mdlTable]: Table } = req.app.locals.db;
		const tables = await Table.findAll({
			order: [[Table_Number, "ASC"]],
		});
		res.status(St_OK).json({ success: true, data: tables });
	} catch (err) {
		res.status(St_INTERNAL_SERVER_ERROR).json({ success: false, message: err.message });
	}
};

export const post = async (req, res) => {
	try {
		const { [mdlTable]: Table } = req.app.locals.db;
		const data = req.body;
		const newTable = await Table.create(data);

		await emitTablesUpdate(req);

		res.status(St_CREATED).json({ success: true, data: newTable, message: "table.success.created" });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};

export const patch = async (req, res) => {
	try {
		const { [mdlTable]: Table } = req.app.locals.db;
		const { [Table_ID]: id, [Table_Status]: status, [Table_Capacity]: capacity } = req.body;
		const table = await Table.findByPk(id);
		if (!table) return res.status(St_NOT_FOUND).json({ success: false, message: "table.error.notFound" });
		if (status !== undefined) table[Table_Status] = status;
		if (capacity !== undefined) table[Table_Capacity] = capacity;
		await table.save();
		await emitTablesUpdate(req);
		res.status(St_OK).json({ success: true, data: table, message: "table.success.updated" });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};

export const put = async (req, res) => {
	try {
		const { [mdlTable]: Table } = req.app.locals.db;
		const { [Table_ID]: id, [Table_Number]: number, [Table_Capacity]: capacity, [Table_Status]: status } = req.body;
		const table = await Table.findByPk(id);
		if (!table) return res.status(St_NOT_FOUND).json({ success: false, message: "table.error.notFound" });
		table[Table_Number] = number;
		table[Table_Capacity] = capacity;
		table[Table_Status] = status;
		await table.save();
		await emitTablesUpdate(req);
		res.status(St_OK).json({ success: true, data: table, message: "table.success.updated" });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};

export const remove = async (req, res) => {
	try {
		const { [mdlTable]: Table } = req.app.locals.db;
		const selectedIds = req.body;
		const { id } = req.params;
		const targetIds = Array.isArray(selectedIds) && selectedIds.length > 0 ? selectedIds : id ? [id] : [];
		if (targetIds.length === 0) {
			return res.status(St_BAD_REQUEST).json({ success: false, message: "table.error.noIdsProvided" });
		}
		const deletedCount = await Table.destroy({
			where: {
				[Table_ID || "id"]: {
					[Op.in]: targetIds,
				},
			},
		});
		if (deletedCount === 0) {
			return res.status(St_NOT_FOUND).json({ success: false, message: "table.error.notFound" });
		}
		await emitTablesUpdate(req);
		return res.status(St_OK).json({
			success: true,
			data: deletedCount,
			message: "table.success.deleted",
		});
	} catch (err) {
		return res.status(St_INTERNAL_SERVER_ERROR).json({ success: false, message: err.message });
	}
};
