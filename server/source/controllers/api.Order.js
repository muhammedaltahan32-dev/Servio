import { mdlOrders, mdlOrderItems, mdlTable, mdlUser, mdlMenuItems } from "../../../constants/modelNames.js";
import { Api_Order } from "../../../constants/SubApi.js";
import { St_BAD_REQUEST, St_CREATED, St_OK, St_INTERNAL_SERVER_ERROR } from "../../../constants/HttpStatus.js";
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
} from "../../../constants/FieldsName.js";

export const subapi = Api_Order;

export const post = async (req, res) => {
	const { sequelize, [mdlOrders]: Order, [mdlOrderItems]: OrderItem } = req.app.locals.db;
	const t = await sequelize.transaction();

	try {
		const {
			[Order_TableID]: table_id,
			[Order_WaiterID]: waiter_id,
			[Order_Subtotal]: subtotal,
			[Order_Tax]: tax_amount,
			[Order_Total]: total_amount,
			items,
		} = req.body;

		const newOrder = await Order.create(
			{
				[Order_TableID]: table_id,
				[Order_WaiterID]: waiter_id,
				[Order_Subtotal]: subtotal,
				[Order_Tax]: tax_amount,
				[Order_Total]: total_amount,
			},
			{ transaction: t },
		);

		if (items && items.length > 0) {
			const orderItemsData = items.map((item) => ({
				[Item_OrderID]: newOrder[Order_ID],
				[Item_MenuID]: item[Item_MenuID],
				[Item_Quantity]: item[Item_Quantity],
				[Item_UnitPrice]: item[Item_UnitPrice],
				[Item_Notes]: item[Item_Notes] || null,
			}));
			await OrderItem.bulkCreate(orderItemsData, { transaction: t });
		}

		await t.commit();
		res.status(St_CREATED).json({ success: true, data: newOrder, message: "order.success.created" });
	} catch (err) {
		await t.rollback();
		res.status(St_INTERNAL_SERVER_ERROR).json({ success: false, error: err.message });
	}
};

export const patch = async (req, res) => {
	try {
		const { [mdlOrders]: Order } = req.app.locals.db;
		const { [Order_ID]: id, [Order_Status]: status } = req.body;

		const order = await Order.findByPk(id);
		if (!order) return res.status(St_BAD_REQUEST).json({ success: false, error: "Order not found" });

		order[Order_Status] = status;
		await order.save();

		res.status(St_OK).json({ success: true, data: order });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, error: err.message });
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
		res.status(St_BAD_REQUEST).json({ success: false, error: err.message });
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
			return res.status(St_BAD_REQUEST).json({ success: false, error: "Order not found" });
		}

		res.status(St_OK).json({ success: true, data: order });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, error: err.message });
	}
};
