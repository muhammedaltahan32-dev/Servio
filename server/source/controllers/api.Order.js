import { mdlOrders, mdlOrderItems, mdlTable, mdlUser, mdlMenuItems } from "../../../constants/modelNames.js";
import { Api_Order } from "../../../constants/SubApi.js";
import { St_BAD_REQUEST, St_CREATED, St_OK, St_INTERNAL_SERVER_ERROR, St_NOT_FOUND } from "../../../constants/HttpStatus.js";
import { ST_AVAILABLE, ST_OCCUPIED } from "../../../constants/enumOptions.js";
import {
	Order_ID,
	Order_TableID,
	Order_WaiterID,
	Order_Status,
	Order_Subtotal,
	Order_Tax,
	Order_Total,
	Order_CreatedAt,
	Item_OrderID,
	Item_MenuID,
	Item_Quantity,
	Item_UnitPrice,
	Item_Notes,
	Table_Number,
	User_Name,
	Menu_Name,
	Menu_Price,
	Menu_IsAvailable,
	Table_Status,
} from "../../../constants/FieldsName.js";

export const subapi = Api_Order;

export const post = async (req, res) => {
	const {
		sequelize,
		[mdlOrders]: Order,
		[mdlOrderItems]: OrderItem,
		[mdlTable]: Table,
		[mdlMenuItems]: MenuItem,
	} = req.app.locals.db;
	const t = await sequelize.transaction();

	try {
		const table_id = Number(req.body?.[Order_TableID]);
		const tax_amount = Number(req.body?.[Order_Tax] ?? 0);
		const items = req.body?.items;
		const waiter_id = req.context?.user?.id;

		if (!waiter_id || !Number.isInteger(table_id) || !Array.isArray(items) || items.length === 0) {
			await t.rollback();
			return res.status(St_BAD_REQUEST).json({ success: false, message: "order.error.invalidData" });
		}

		const table = await Table.findByPk(table_id, { transaction: t });
		if (!table) {
			await t.rollback();
			return res.status(St_NOT_FOUND).json({ success: false, message: "table.error.notFound" });
		}
		if (table[Table_Status] !== ST_AVAILABLE) {
			await t.rollback();
			return res.status(St_BAD_REQUEST).json({ success: false, message: "order.error.tableUnavailable" });
		}

		const menuIds = items.map((item) => Number(item?.[Item_MenuID]));
		const menuItems = await MenuItem.findAll({ where: { id: menuIds }, transaction: t });
		const menuById = new Map(menuItems.map((item) => [Number(item.id), item]));
		const hasInvalidItem = items.some((item) => {
			const menuItem = menuById.get(Number(item?.[Item_MenuID]));
			const quantity = Number(item?.[Item_Quantity]);
			return !menuItem || menuItem[Menu_IsAvailable] === false || !Number.isInteger(quantity) || quantity < 1;
		});
		if (hasInvalidItem) {
			await t.rollback();
			return res.status(St_BAD_REQUEST).json({ success: false, message: "order.error.invalidData" });
		}
		const orderItemsData = items.map((item) => {
			const menuItem = menuById.get(Number(item?.[Item_MenuID]));
			const quantity = Number(item?.[Item_Quantity]);
			return {
				[Item_MenuID]: menuItem.id,
				[Item_Quantity]: quantity,
				[Item_UnitPrice]: menuItem[Menu_Price],
				[Item_Notes]: item[Item_Notes] || null,
			};
		});
		const subtotal = orderItemsData.reduce(
			(sum, item) => sum + Number(item[Item_UnitPrice]) * item[Item_Quantity],
			0,
		);
		const tax = Number.isFinite(tax_amount) && tax_amount >= 0 ? tax_amount : 0;
		const total_amount = subtotal + tax;

		const newOrder = await Order.create(
			{
				[Order_TableID]: table_id,
				[Order_WaiterID]: waiter_id,
				[Order_Subtotal]: subtotal,
				[Order_Tax]: tax,
				[Order_Total]: total_amount,
			},
			{ transaction: t },
		);

		await OrderItem.bulkCreate(
			orderItemsData.map((item) => ({ ...item, [Item_OrderID]: newOrder[Order_ID] })),
			{ transaction: t },
		);
		table[Table_Status] = ST_OCCUPIED;
		await table.save({ transaction: t });

		await t.commit();
		const io = req.app.locals.io;
		if (io) {
			const tables = await Table.findAll({ order: [["table_number", "ASC"]] });
			io.emit("tables:updated", tables);
		}
		res.status(St_CREATED).json({ success: true, data: newOrder, message: "order.success.created" });
	} catch (err) {
		if (!t.finished) await t.rollback();
		console.error(err);
		res.status(St_INTERNAL_SERVER_ERROR).json({ success: false, message: "error.messages.serverError" });
	}
};

export const patch = async (req, res) => {
	try {
		const { [mdlOrders]: Order } = req.app.locals.db;
		const { [Order_ID]: id, [Order_Status]: status } = req.body;

		const order = await Order.findByPk(id);
		if (!order) return res.status(St_BAD_REQUEST).json({ success: false, message: "order.error.notFound" });

		order[Order_Status] = status;
		await order.save();

		res.status(St_OK).json({ success: true, data: order });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: "error.messages.serverError" });
	}
};

export const getAll = async (req, res, params) => {
	try {
		const { [mdlOrders]: Order, [mdlTable]: Table, [mdlUser]: User } = req.app.locals.db;
		const { [Order_Status]: status } = params;
		const whereClause = status ? { [Order_Status]: status } : {};
		const orders = await Order.findAll({
			where: whereClause,
			include: [
				{ model: Table, attributes: [Table_Number] },
				{ model: User, attributes: [User_Name] },
			],
			order: [[Order_CreatedAt, "ASC"]],
		});
		res.status(St_OK).json({ success: true, data: orders });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: "error.messages.serverError" });
	}
};

export const getOne = async (id, req, res) => {
	try {
		const {
			[mdlOrders]: Order,
			[mdlOrderItems]: OrderItem,
			[mdlMenuItems]: MenuItem,
			[mdlTable]: Table,
		} = req.app.locals.db;

		const order = await Order.findByPk(id, {
			include: [
				{ model: Table, attributes: [Table_Number] },
				{
					model: OrderItem,
					include: [{ model: MenuItem, attributes: [Menu_Name, Menu_Price] }],
				},
			],
		});

		if (!order) {
			return res.status(St_BAD_REQUEST).json({ success: false, message: "order.error.notFound" });
		}
		res.status(St_OK).json({ success: true, data: order });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: "error.messages.serverError" });
	}
};
