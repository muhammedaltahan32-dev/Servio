import { mdlPayments, mdlOrders, mdlTable } from "../../../constants/modelNames.js";
import { Api_Payment } from "../../../constants/SubApi.js";
import { St_BAD_REQUEST, St_CREATED, St_INTERNAL_SERVER_ERROR, St_OK } from "../../../constants/HttpStatus.js";
import {
	Pay_OrderID,
	Pay_Method,
	Pay_Amount,
	Pay_CreatedAt,
	Order_TableID,
	Order_Total,
	Order_Status,
	Table_Status,
} from "../../../constants/FieldsName.js";

export const subapi = Api_Payment;

export const getAll = async (req, res, params) => {
	try {
		const { [mdlPayments]: Payment, [mdlOrders]: Order } = req.app.locals.db;
		const payments = await Payment.findAll({
			include: [{ model: Order, attributes: [Order_TableID, Order_Total] }],
			order: [[Pay_CreatedAt, "DESC"]],
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
		const { [Pay_OrderID]: order_id, [Pay_Method]: payment_method, [Pay_Amount]: amount_paid } = req.body;

		const newPayment = await Payment.create(
			{
				[Pay_OrderID]: order_id,
				[Pay_Method]: payment_method,
				[Pay_Amount]: amount_paid,
			},
			{ transaction: t },
		);

		const order = await Order.findByPk(order_id, { transaction: t });
		if (!order) throw new Error("Order not found");

		order[Order_Status] = "PAID";
		await order.save({ transaction: t });

		const table = await Table.findByPk(order[Order_TableID], { transaction: t });
		if (table) {
			table[Table_Status] = "NEEDS_CLEANING";
			await table.save({ transaction: t });
		}

		await t.commit();
		res.status(St_CREATED).json({ success: true, data: newPayment, message: "Payment successful" });
	} catch (err) {
		await t.rollback();
		res.status(St_INTERNAL_SERVER_ERROR).json({ success: false, error: err.message });
	}
};
