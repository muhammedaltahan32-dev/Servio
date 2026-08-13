import { mdlOrders, mdlTable, mdlUser, mdlOrderItems, mdlPayments } from "../../../constants/modelNames.js";
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
} from "../../../constants/FieldsName.js";

const defineOrders = (sequelize, DataTypes) => {
	const model = sequelize.define(
		mdlOrders,
		{
			[Order_ID]: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			[Order_TableID]: { type: DataTypes.INTEGER, allowNull: false },
			[Order_WaiterID]: { type: DataTypes.INTEGER, allowNull: false },
			[Order_Status]: {
				type: DataTypes.ENUM("PENDING", "PREPARING", "READY", "SERVED", "PAID", "CANCELLED"),
				defaultValue: "PENDING",
			},
			[Order_Subtotal]: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
			[Order_Tax]: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
			[Order_Total]: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
			[Order_CreatedAt]: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			[Order_UpdatedAt]: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		},
		{
			tableName: "orders",
			timestamps: false,
		},
	);

	const defineRelation = (models) => {
		model.belongsTo(models[mdlTable], { foreignKey: Order_TableID });
		model.belongsTo(models[mdlUser], { foreignKey: Order_WaiterID });
		model.hasMany(models[mdlOrderItems], { foreignKey: "order_id", onDelete: "CASCADE" });
		model.hasMany(models[mdlPayments], { foreignKey: "order_id" });
	};

	return [mdlOrders, model, defineRelation];
};

export default defineOrders;
