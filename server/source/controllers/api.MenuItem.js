import { mdlMenuItems, mdlCategories } from "../../../constants/modelNames.js";
import { Api_MenuItem } from "../../../constants/SubApi.js";
import { St_BAD_REQUEST, St_CREATED, St_OK } from "../../../constants/HttpStatus.js";
import { Menu_CatID, Cat_Name } from "../../../constants/FieldsName.js";

export const subapi = Api_MenuItem;

export const getAll = async (req, res, params) => {
	try {
		const { [mdlMenuItems]: MenuItem, [mdlCategories]: Category } = req.app.locals.db;
		const { [Menu_CatID]: category_id } = params;

		const whereClause = category_id ? { [Menu_CatID]: category_id } : {};

		const items = await MenuItem.findAll({
			where: whereClause,
			include: [{ model: Category, attributes: [Cat_Name] }],
		});
		res.status(St_OK).json({ success: true, data: items });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};

export const post = async (req, res) => {
	try {
		const { [mdlMenuItems]: MenuItem } = req.app.locals.db;
		const data = req.body;
		// data.base_image & data.images will be handled by Sequelize setters automatically
		const newItem = await MenuItem.create(data);
		res.status(St_CREATED).json({ success: true, data: newItem });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};
