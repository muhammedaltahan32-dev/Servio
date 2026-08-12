import { mdlOrderItems, mdlOrders, mdlMenuItems } from "../../../constants/modelNames.js";
import {
	Item_ID,
	Item_OrderID,
	Item_MenuID,
	Item_Quantity,
	Item_UnitPrice,
	Item_Notes,
} from "../../../constants/FieldsName.js";

const defineOrderItems = (sequelize, DataTypes) => {
	const model = sequelize.define(
		mdlOrderItems,
		{
			[Item_ID]: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			[Item_OrderID]: { type: DataTypes.INTEGER, allowNull: false },
			[Item_MenuID]: { type: DataTypes.INTEGER, allowNull: false },
			[Item_Quantity]: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
			[Item_UnitPrice]: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
			[Item_Notes]: { type: DataTypes.TEXT, allowNull: true },
		},
		{
			tableName: "order_items",
			timestamps: false,
		},
	);

	const defineRelation = (models) => {
		model.belongsTo(models[mdlOrders], { foreignKey: Item_OrderID, onDelete: "CASCADE" });
		model.belongsTo(models[mdlMenuItems], { foreignKey: Item_MenuID });
	};

	return [mdlOrderItems, model, defineRelation];
};

export default defineOrderItems;
