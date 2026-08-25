import { mdlCategories } from "../../../constants/modelNames.js";
import { Api_Category } from "../../../constants/SubApi.js";
import { St_BAD_REQUEST, St_CREATED, St_OK } from "../../../constants/HttpStatus.js";
import { Cat_Sort } from "../../../constants/FieldsName.js";

export const subapi = Api_Category;

export const getAll = async (req, res, params) => {
	try {
		const { [mdlCategories]: Category } = req.app.locals.db;
		const categories = await Category.findAll({ order: [[Cat_Sort, "ASC"]] });
		res.status(St_OK).json({ success: true, data: categories });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};

export const post = async (req, res) => {
	try {
		const { [mdlCategories]: Category } = req.app.locals.db;
		const data = req.body;
		const newCategory = await Category.create(data);
		res.status(St_CREATED).json({ success: true, data: newCategory, message: "messages.success.add.category" });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};

export const remove = async (req, res) => {
	try {
		const { [mdlCategories]: Category } = req.app.locals.db;
		const id = req.params.id;
		if (!id) {
			return res.status(St_BAD_REQUEST).json({ success: false, message: "messages.required.category.ID" });
		}
		const deletedCount = await Category.destroy({ where: { id } });
		if (deletedCount === 0) {
			return res.status(St_BAD_REQUEST).json({ success: false, message: "messages.notFound.category" });
		}
		res.status(St_OK).json({ success: true, message: "messages.success.delete.category" });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};

export const put = async (req, res) => {
	try {
		const { [mdlCategories]: Category } = req.app.locals.db;
		const id = req.body.id;
		const data = req.body;
		const [updatedCount] = await Category.update(data, { where: { id } });
		if (updatedCount === 0) {
			return res.status(St_BAD_REQUEST).json({ success: false, message: "messages.notFound.category" });
		}
		res.status(St_OK).json({ success: true, message: "messages.success.update.category" });
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};
