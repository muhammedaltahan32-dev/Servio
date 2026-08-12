import { mdlPayments, mdlOrders } from "../../../constants/modelNames.js";
import { Pay_ID, Pay_OrderID, Pay_Method, Pay_Amount, Pay_CreatedAt } from "../../../constants/FieldsName.js";

const definePayments = (sequelize, DataTypes) => {
	const model = sequelize.define(
		mdlPayments,
		{
			[Pay_ID]: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			[Pay_OrderID]: { type: DataTypes.INTEGER, allowNull: false },
			[Pay_Method]: { type: DataTypes.ENUM("CASH", "CARD"), allowNull: false },
			[Pay_Amount]: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
			[Pay_CreatedAt]: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		},
		{
			tableName: "payments",
			timestamps: false,
		},
	);

	const defineRelation = (models) => {
		model.belongsTo(models[mdlOrders], { foreignKey: Pay_OrderID });
	};

	return [mdlPayments, model, defineRelation];
};

export default definePayments;
