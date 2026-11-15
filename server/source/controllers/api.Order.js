import { mdlOrders, mdlOrderItems, mdlTable, mdlUser, mdlMenuItems, mdlPayments } from "../../../constants/modelNames.js";
import { Api_Order } from "../../../constants/SubApi.js";
import {
	St_BAD_REQUEST,
	St_CREATED,
	St_OK,
	St_INTERNAL_SERVER_ERROR,
	St_NOT_FOUND,
} from "../../../constants/HttpStatus.js";
import { Op } from "sequelize";
import {
	ORDER_STATUS_VALUES,
	OrderStatus_CANCELLED,
	OrderStatus_PAID,
	OrderStatus_PENDING,
	OrderStatus_PREPARING,
	OrderStatus_READY,
	OrderStatus_SERVED,
	ST_AVAILABLE,
	ST_NEEDS_CLEANING,
	ST_OCCUPIED,
} from "../../../constants/enumOptions.js";
import {
	Order_ID,
	Order_TableID,
	Order_WaiterID,
	Order_Status,
	Order_Subtotal,
	Order_Tax,
	Order_Total,
	Order_CreatedAt,
	Order_UpdatedAt,
	Item_ID,
	Item_OrderID,
	Item_MenuID,
	Item_Quantity,
	Item_UnitPrice,
	Item_Notes,
	Table_Number,
	User_Name,
	Menu_Name_AR,
	Menu_Name_EN,
	Menu_Price,
	Menu_IsAvailable,
	Table_Status,
	Pay_OrderID,
	Pay_Method,
	Pay_Amount,
} from "../../../constants/FieldsName.js";

export const subapi = Api_Order;

const ACTIVE_ORDER_STATUSES = [
	OrderStatus_PENDING,
	OrderStatus_PREPARING,
	OrderStatus_READY,
	OrderStatus_SERVED,
];

const getStartOfDay = (daysAgo = 0) => {
	const date = new Date();
	date.setHours(0, 0, 0, 0);
	if (daysAgo > 0) {
		date.setDate(date.getDate() - daysAgo);
	}
	return date;
};

const buildOrderIncludes = ({ Table, User, OrderItem, MenuItem }) => [
	{ model: Table, attributes: [Table_Number] },
	{ model: User, attributes: [User_Name] },
	{
		model: OrderItem,
		attributes: [Item_ID, Item_MenuID, Item_Quantity, Item_UnitPrice, Item_Notes],
		include: [{ model: MenuItem, attributes: [Menu_Name_AR, Menu_Name_EN, Menu_Price] }],
	},
];

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
		const subtotal = orderItemsData.reduce((sum, item) => sum + Number(item[Item_UnitPrice]) * item[Item_Quantity], 0);
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
			io.emit("orders:changed");
		}
		res.status(St_CREATED).json({ success: true, data: newOrder, message: "order.success.created" });
	} catch (err) {
		if (!t.finished) await t.rollback();
		console.error(err);
		res.status(St_INTERNAL_SERVER_ERROR).json({ success: false, message: "error.messages.serverError" });
	}
};

export const patch = async (req, res) => {
	const {
		sequelize,
		[mdlOrders]: Order,
		[mdlOrderItems]: OrderItem,
		[mdlTable]: Table,
		[mdlUser]: User,
		[mdlMenuItems]: MenuItem,
		[mdlPayments]: Payment,
	} = req.app.locals.db;
	const t = await sequelize.transaction();

	try {
		const { [Order_ID]: id, [Order_Status]: status, [Pay_Method]: paymentMethod } = req.body;
		if (!id || !ORDER_STATUS_VALUES.includes(status)) {
			await t.rollback();
			return res.status(St_BAD_REQUEST).json({ success: false, message: "order.error.invalidData" });
		}

		const order = await Order.findByPk(id, { transaction: t });
		if (!order) {
			await t.rollback();
			return res.status(St_NOT_FOUND).json({ success: false, message: "order.error.notFound" });
		}

		const previousStatus = order[Order_Status];
		order[Order_Status] = status;
		order[Order_UpdatedAt] = new Date();
		await order.save({ transaction: t });

		let tableUpdated = false;

		if (status === OrderStatus_PAID && Payment) {
			const existingPayment = await Payment.findOne({
				where: { [Pay_OrderID]: order[Order_ID] },
				transaction: t,
			});
			if (!existingPayment) {
				const normalizedMethod = String(paymentMethod || "CASH").toUpperCase() === "CARD" ? "CARD" : "CASH";
				await Payment.create(
					{
						[Pay_OrderID]: order[Order_ID],
						[Pay_Method]: normalizedMethod,
						[Pay_Amount]: order[Order_Total],
					},
					{ transaction: t },
				);
			}
		}

		if (status === OrderStatus_PAID || status === OrderStatus_CANCELLED) {
			const tableId = order[Order_TableID];
			const otherActiveOrders = await Order.count({
				where: {
					[Order_TableID]: tableId,
					[Order_ID]: { [Op.ne]: order[Order_ID] },
					[Order_Status]: { [Op.in]: ACTIVE_ORDER_STATUSES },
				},
				transaction: t,
			});

			if (otherActiveOrders === 0 && Table) {
				const table = await Table.findByPk(tableId, { transaction: t });
				if (table) {
					const nextTableStatus =
						status === OrderStatus_PAID || previousStatus === OrderStatus_SERVED
							? ST_NEEDS_CLEANING
							: ST_AVAILABLE;
					if (table[Table_Status] !== nextTableStatus) {
						table[Table_Status] = nextTableStatus;
						await table.save({ transaction: t });
						tableUpdated = true;
					}
				}
			}
		}

		await t.commit();

		const updatedOrder = await Order.findByPk(order[Order_ID], {
			include: buildOrderIncludes({ Table, User, OrderItem, MenuItem }),
		});

		const io = req.app.locals.io;
		if (io) {
			if (tableUpdated && Table) {
				const tables = await Table.findAll({ order: [[Table_Number, "ASC"]] });
				io.emit("tables:updated", tables);
			}
			io.emit("orders:changed");
		}

		res.status(St_OK).json({ success: true, data: updatedOrder || order, message: "orders.statusUpdated" });
	} catch (err) {
		if (!t.finished) await t.rollback();
		console.error(err);
		res.status(St_BAD_REQUEST).json({ success: false, message: "error.messages.serverError" });
	}
};

export const getAll = async (req, res, params = {}) => {
	try {
		const {
			[mdlOrders]: Order,
			[mdlTable]: Table,
			[mdlUser]: User,
			[mdlOrderItems]: OrderItem,
			[mdlMenuItems]: MenuItem,
		} = req.app.locals.db;

		let status = params?.[Order_Status] || req.query?.[Order_Status];
		const scope = params?.scope || req.query?.scope;
		const daysParam = Number(params?.days ?? req.query?.days);
		const startOfToday = getStartOfDay(0);

		let whereClause = {};

		if (status) {
			if (typeof status === "string" && status.includes(",")) {
				status = status.split(",").map((s) => s.trim());
			}
			const statuses = Array.isArray(status) ? status : [status];
			whereClause = {
				[Op.and]: [
					{ [Order_Status]: { [Op.in]: statuses } },
					{
						[Op.or]: [
							{ [Order_Status]: { [Op.in]: ACTIVE_ORDER_STATUSES } },
							{ [Order_CreatedAt]: { [Op.gte]: startOfToday } },
						],
					},
				],
			};
		} else if (scope === "active") {
			whereClause = { [Order_Status]: { [Op.in]: ACTIVE_ORDER_STATUSES } };
		} else if (scope === "completedToday") {
			whereClause = {
				[Order_Status]: { [Op.in]: [OrderStatus_PAID, OrderStatus_CANCELLED] },
				[Order_CreatedAt]: { [Op.gte]: startOfToday },
			};
		} else if (Number.isFinite(daysParam) && daysParam > 0) {
			const startDate = getStartOfDay(Math.min(daysParam - 1, 90));
			whereClause = {
				[Op.or]: [
					{ [Order_Status]: { [Op.in]: ACTIVE_ORDER_STATUSES } },
					{ [Order_CreatedAt]: { [Op.gte]: startDate } },
				],
			};
		} else {
			// Default operational query: active orders + today's completed orders only
			whereClause = {
				[Op.or]: [
					{ [Order_Status]: { [Op.in]: ACTIVE_ORDER_STATUSES } },
					{ [Order_CreatedAt]: { [Op.gte]: startOfToday } },
				],
			};
		}

		const orders = await Order.findAll({
			where: whereClause,
			include: buildOrderIncludes({ Table, User, OrderItem, MenuItem }),
			order: [[Order_CreatedAt, "DESC"]],
		});

		res.status(St_OK).json({ success: true, data: orders });
	} catch (err) {
		console.error(err);
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
			[mdlUser]: User,
		} = req.app.locals.db;

		const order = await Order.findByPk(id, {
			include: buildOrderIncludes({ Table, User, OrderItem, MenuItem }),
		});

		if (!order) {
			return res.status(St_BAD_REQUEST).json({ success: false, message: "order.error.notFound" });
		}
		res.status(St_OK).json({ success: true, data: order });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: "error.messages.serverError" });
	}
};
