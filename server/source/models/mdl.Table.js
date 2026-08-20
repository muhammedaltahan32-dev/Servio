import { mdlTable } from "../../../constants/modelNames.js";
import {
	Table_ID,
	Table_Number,
	Table_Capacity,
	Table_Status,
	Table_UpdatedAt,
} from "../../../constants/FieldsName.js";
import { ST_AVAILABLE, ST_NEEDS_CLEANING, ST_OCCUPIED } from "../../../constants/enumOptions.js";

const defineTables = (sequelize, DataTypes) => {
	const model = sequelize.define(
		mdlTable,
		{
			[Table_ID]: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			[Table_Number]: { type: DataTypes.INTEGER, allowNull: false, unique: true },
			[Table_Capacity]: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 4 },
			[Table_Status]: {
				type: DataTypes.ENUM(ST_AVAILABLE, ST_OCCUPIED, ST_NEEDS_CLEANING),
				defaultValue: ST_AVAILABLE,
			},
			[Table_UpdatedAt]: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			tableName: "table",
			timestamps: false,
		},
	);

	return [mdlTable, model];
};

export default defineTables;
