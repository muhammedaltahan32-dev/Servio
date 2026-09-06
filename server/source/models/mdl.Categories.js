import { mdlCategories, mdlMenuItems } from "../../../constants/modelNames.js";
import { Cat_ID, Cat_Name, Cat_Name_AR, Cat_Name_EN, Cat_Sort } from "../../../constants/FieldsName.js";

const defineCategories = (sequelize, DataTypes) => {
	const model = sequelize.define(
		mdlCategories,
		{
			[Cat_ID]: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			[Cat_Name_AR]: { type: DataTypes.STRING(100) },
			[Cat_Name_EN]: { type: DataTypes.STRING(100) },
			[Cat_Sort]: { type: DataTypes.INTEGER, defaultValue: 0 },
		},
		{
			tableName: "categories",
			timestamps: false,
		},
	);

	const defineRelation = (models) => {
		model.hasMany(models[mdlMenuItems], { foreignKey: "category_id", onDelete: "CASCADE" });
	};

	return [mdlCategories, model, defineRelation];
};

export default defineCategories;
