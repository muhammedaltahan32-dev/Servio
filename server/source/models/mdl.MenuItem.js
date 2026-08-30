import { mdlMenuItems, mdlCategories } from "../../../constants/modelNames.js";
import {
	Menu_ID,
	Menu_CatID,
	Menu_Name,
	Menu_Price,
	Menu_IsAvailable,
	Menu_BaseImage,
	Menu_Images,
	Menu_Descriptions,
} from "../../../constants/FieldsName.js";

const normalizeImagePath = (val) => {
	if (!val) return null;
	const basePaths = [
		"http://localhost:3000",
		"http://localhost:3001",
		"http://127.0.0.1:3000",
		"http://127.0.0.1:3001",
	];
	let cleaned = val;
	for (const basePath of basePaths) {
		cleaned = cleaned.replace(basePath, "");
	}
	return cleaned.replace(/^\/+/, "");
};

const defineMenuItems = (sequelize, DataTypes) => {
	const FULL_PATH = (process.env.FULL_PATH || "http://localhost:3001/").replace(/\/$/, "/");

	const model = sequelize.define(
		mdlMenuItems,
		{
			[Menu_ID]: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			[Menu_CatID]: { type: DataTypes.INTEGER, allowNull: false },
			[Menu_Name]: { type: DataTypes.STRING(150), allowNull: false },
			[Menu_Price]: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
			[Menu_IsAvailable]: { type: DataTypes.BOOLEAN, defaultValue: true },
			[Menu_Descriptions]: { type: DataTypes.TEXT, allowNull: true },
			[Menu_BaseImage]: {
				type: DataTypes.STRING(200),
				allowNull: true,
				get() {
					const file = this.getDataValue(Menu_BaseImage);
					if (!file) return null;
					return `${FULL_PATH}${file}`;
				},
				set(value) {
					if (!value) {
						this.setDataValue(Menu_BaseImage, null);
						return;
					}
					const cleaned = normalizeImagePath(value);
					this.setDataValue(Menu_BaseImage, cleaned);
				},
			},
			[Menu_Images]: {
				type: DataTypes.TEXT("medium"),
				allowNull: true,
				get() {
					const raw = this.getDataValue(Menu_Images);
					const arr = raw ? JSON.parse(raw) : [];
					return arr.map((img) => `${FULL_PATH}${img}`);
				},
				set(value) {
					if (!Array.isArray(value)) {
						this.setDataValue(Menu_Images, JSON.stringify([]));
						return;
					}
					const cleaned = value.map((img) => normalizeImagePath(img));
					this.setDataValue(Menu_Images, JSON.stringify(cleaned));
				},
			},
		},
		{
			tableName: "menu_items",
			timestamps: false,
		},
	);

	const defineRelation = (models) => {
		model.belongsTo(models[mdlCategories], { foreignKey: Menu_CatID, onDelete: "CASCADE" });
	};

	return [mdlMenuItems, model, defineRelation];
};

export default defineMenuItems;
