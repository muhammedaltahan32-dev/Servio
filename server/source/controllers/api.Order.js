import { mdlOrders, mdlOrderItems, mdlTable, mdlUser, mdlMenuItems } from "../../../constants/modelNames.js";
import { Api_Order } from "../../../constants/SubApi.js";
import { St_BAD_REQUEST, St_CREATED, St_OK, St_INTERNAL_SERVER_ERROR } from "../../../constants/HttpStatus.js";

export const subapi = Api_Order;

export const post = async (req, res) => {
	const { sequelize, [mdlOrders]: Order, [mdlOrderItems]: OrderItem } = req.app.locals.db;
	const t = await sequelize.transaction();

	try {
		const { table_id, waiter_id, subtotal, tax_amount, total_amount, items } = req.body;

		const newOrder = await Order.create(
			{
				table_id,
				waiter_id,
				subtotal,
				tax_amount,
				total_amount,
			},
			{ transaction: t },
		);

		if (items && items.length > 0) {
			const orderItemsData = items.map((item) => ({
				order_id: newOrder.id,
				menu_item_id: item.menu_item_id,
				quantity: item.quantity,
				unit_price: item.unit_price,
				notes: item.notes || null,
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
		const { id, status } = req.body; // status: 'PREPARING', 'READY', 'SERVED', etc.

		const order = await Order.findByPk(id);
		if (!order) return res.status(St_BAD_REQUEST).json({ success: false, error: "Order not found" });

		order.status = status;
		await order.save();

		res.status(St_OK).json({ success: true, data: order });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, error: err.message });
	}
};

export const getAll = async (req, res, params) => {
	try {
		const { [mdlOrders]: Order, [mdlTable]: Table, [mdlUser]: User } = req.app.locals.db;

		const { status } = params;

		const whereClause = status ? { status } : {};

		const orders = await Order.findAll({
			where: whereClause,
			include: [
				{ model: Table, attributes: ["table_number"] },
				{ model: User, attributes: ["username"] },
			],
			order: [["created_at", "ASC"]], // old first
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
				{ model: Table, attributes: ["table_number"] },
				{
					model: OrderItem,
					include: [{ model: MenuItem, attributes: ["name", "price"] }],
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
