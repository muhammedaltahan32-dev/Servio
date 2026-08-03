import { mdlUser } from "../../../constants/modelNames.js";
import { User_ID, User_Name, User_Password, User_Kind } from "../../../constants/FieldsName.js";
import { Kind_ADMIN, Kind_KITCHEN, Kind_WAITER } from "../../../constants/user.js";

const defineUser = (sequelize, DataTypes) => {
	const model = sequelize.define(
		mdlUser,
		{
			[User_ID]: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			[User_Name]: { type: DataTypes.STRING(40), allowNull: false },
			[User_Password]: { type: DataTypes.STRING(200), allowNull: false },
			[User_Kind]: { type: DataTypes.ENUM(Kind_ADMIN, Kind_KITCHEN, Kind_WAITER), allowNull: false },
		},
		{
			tableName: "user",
			timestamps: false,
		},
	);

	return [mdlUser, model];
};

export default defineUser;
