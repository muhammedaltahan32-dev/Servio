import { mdlPayments, mdlOrders, mdlTable } from "../../../constants/modelNames.js";
import { Api_Payment } from "../../../constants/SubApi.js";
import { St_BAD_REQUEST, St_CREATED, St_INTERNAL_SERVER_ERROR, St_OK } from "../../../constants/HttpStatus.js";

export const subapi = Api_Payment;

export const getAll = async (req, res, params) => {
	try {
		const { [mdlPayments]: Payment, [mdlOrders]: Order } = req.app.locals.db;
		const payments = await Payment.findAll({
			include: [{ model: Order, attributes: ["table_id", "total_amount"] }],
			order: [["created_at", "DESC"]],
		});
		res.status(St_OK).json({ success: true, data: payments });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, error: err.message });
	}
};

export const post = async (req, res) => {
	const { sequelize, [mdlPayments]: Payment, [mdlOrders]: Order, [mdlTable]: Table } = req.app.locals.db;
	const t = await sequelize.transaction();

	try {
		const { order_id, payment_method, amount_paid } = req.body;

		const newPayment = await Payment.create(
			{
				order_id,
				payment_method,
				amount_paid,
			},
			{ transaction: t },
		);

		const order = await Order.findByPk(order_id, { transaction: t });
		if (!order) throw new Error("Order not found");

		order.status = "PAID";
		await order.save({ transaction: t });

		const table = await Table.findByPk(order.table_id, { transaction: t });
		if (table) {
			table.status = "NEEDS_CLEANING";
			await table.save({ transaction: t });
		}

		await t.commit();
		res.status(St_CREATED).json({ success: true, data: newPayment, message: "Payment successful" });
	} catch (err) {
		await t.rollback();
		res.status(St_INTERNAL_SERVER_ERROR).json({ success: false, error: err.message });
	}
};
