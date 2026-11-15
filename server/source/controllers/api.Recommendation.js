import { Op } from "sequelize";
import { mdlMenuItems, mdlOrderItems, mdlOrders } from "../../../constants/modelNames.js";
import { Api_Recommendation } from "../../../constants/SubApi.js";
import {
	Item_MenuID,
	Order_ID,
	Order_Status,
	Menu_ID,
	Menu_Name_AR,
	Menu_Name_EN,
	Menu_Price,
	Menu_IsAvailable,
	Menu_Description_AR,
	Menu_Description_EN,
	Menu_BaseImage,
	Menu_Images,
} from "../../../constants/FieldsName.js";
import { OrderStatus_PAID } from "../../../constants/enumOptions.js";
import { St_BAD_REQUEST, St_INTERNAL_SERVER_ERROR, St_NOT_FOUND, St_OK } from "../../../constants/HttpStatus.js";
import { recommendCompanions } from "../services/recommendationEngine.js";

export const subapi = Api_Recommendation;

export const getOne = async (dishId, req, res) => {
	const parsedDishId = Number(dishId);
	if (!Number.isSafeInteger(parsedDishId) || parsedDishId <= 0) {
		return res.status(St_BAD_REQUEST).json({ success: false, message: "recommendations.error.invalidDishId" });
	}

	try {
		const { [mdlOrders]: Order, [mdlOrderItems]: OrderItem, [mdlMenuItems]: MenuItem } = req.app.locals.db;
		const requestedDish = await MenuItem.findByPk(parsedDishId, { attributes: [Menu_ID] });
		if (!requestedDish) {
			return res.status(St_NOT_FOUND).json({ success: false, message: "menuItem.error.notFound" });
		}

		const completedOrders = await Order.findAll({
			where: { [Order_Status]: OrderStatus_PAID },
			attributes: [Order_ID],
			include: [{ model: OrderItem, attributes: [Item_MenuID], required: true }],
		});
		const transactions = completedOrders.map((order) =>
			[...new Set((order.OrderItems || []).map((item) => Number(item[Item_MenuID])).filter(Number.isSafeInteger))],
		).filter((items) => items.length > 0);

		const rules = await recommendCompanions(transactions, parsedDishId);
		const recommendedIds = rules.map((rule) => rule.dishId);
		const recommendedDishes = recommendedIds.length
			? await MenuItem.findAll({
				where: { [Menu_ID]: { [Op.in]: recommendedIds }, [Menu_IsAvailable]: true },
				attributes: [Menu_ID, Menu_Name_AR, Menu_Name_EN, Menu_Price, Menu_Description_AR, Menu_Description_EN, Menu_BaseImage, Menu_Images],
			})
			: [];
		const detailsById = new Map(recommendedDishes.map((dish) => [Number(dish[Menu_ID]), dish]));
		const recommendations = rules
			.filter((rule) => detailsById.has(rule.dishId))
			.map((rule) => ({ ...rule, dish: detailsById.get(rule.dishId) }));

		return res.status(St_OK).json({
			success: true,
			data: { dishId: parsedDishId, transactionCount: transactions.length, recommendations },
		});
	} catch (error) {
		console.error("Recommendation generation failed:", error);
		return res.status(St_INTERNAL_SERVER_ERROR).json({ success: false, message: "error.messages.serverError" });
	}
};

