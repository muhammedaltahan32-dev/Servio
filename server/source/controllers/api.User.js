import {
	User_HashedPassword,
	User_IsActive,
	User_Kind,
	User_Name,
	User_Password,
} from "../../../constants/FieldsName.js";
import { St_BAD_REQUEST, St_CREATED } from "../../../constants/HttpStatus.js";
import { mdlUser } from "../../../constants/modelNames.js";
import { Api_User } from "../../../constants/SubApi.js";
import { allowedRoles_User } from "../../../constants/enumOptions.js";
import { hashPassword } from "./authentication/hashPassword.js";

export const subapi = Api_User;

const validateUser = async (data, User) => {
	const { [User_Name]: name, [User_Password]: password, [User_Kind]: kind } = data;
	if (!name) return { message: "auth.validation.nameRequired" };
	if (!password) return { message: "auth.validation.passwordRequired" };
	if (!kind) return { message: "auth.validation.kindRequired" };
	if (!allowedRoles_User.includes(kind)) {
		return { message: "auth.validation.invalidKind" };
	}
	if (await User.findOne({ where: { [User_Name]: name } })) {
		return { message: "auth.validation.nameExists" };
	}
	return null;
};

const addUser = async (data, User) => {
	const validation = await validateUser(data, User);
	if (validation?.message) {
		throw validation;
	}
	const hashedPassword = await hashPassword(data[User_Password]);
	data[User_HashedPassword] = hashedPassword;
	data[User_IsActive] = true;
	return await User.create(data);
};

export const post = async (req, res) => {
	try {
		const { [mdlUser]: User } = req.app.locals.db;
		const data = req.body;
		await addUser(data, User);
		res.status(St_CREATED).json({
			success: true,
			message: "user.success.created",
		});
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, error: err.message });
	}
};

