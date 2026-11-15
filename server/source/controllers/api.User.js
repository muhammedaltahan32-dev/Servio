import {
	User_HashedPassword,
	User_ID,
	User_IsActive,
	User_Kind,
	User_Name,
	User_Password,
} from "../../../constants/FieldsName.js";
import { St_BAD_REQUEST, St_CREATED, St_NOT_FOUND, St_OK } from "../../../constants/HttpStatus.js";
import { mdlUser } from "../../../constants/modelNames.js";
import { Api_User } from "../../../constants/SubApi.js";
import { allowedRoles_User, Kind_KITCHEN, Kind_WAITER, KINDS_VALUES } from "../../../constants/enumOptions.js";
import { hashPassword } from "./authentication/hashPassword.js";
import { RecUser_ID } from "../models/systemRecords.js";

export const subapi = Api_User;

const KIND_BY_NUMBER = Object.fromEntries(
	Object.entries(KINDS_VALUES).map(([roleKey, roleNum]) => [String(roleNum), roleKey]),
);

const normalizeKind = (kind) => KIND_BY_NUMBER[String(kind)] || kind;

const isAllowedRole = (kind) =>
	allowedRoles_User.includes(Number(kind)) || [Kind_KITCHEN, Kind_WAITER].includes(String(kind));

const sanitizeUser = (userInstance) => {
	if (!userInstance) return null;
	const plain = typeof userInstance.toJSON === "function" ? userInstance.toJSON() : { ...userInstance };
	delete plain[User_HashedPassword];
	delete plain[User_Password];
	return plain;
};

const validateUser = async (data, User) => {
	const { [User_Name]: name, [User_Password]: password, [User_Kind]: kind } = data;
	if (!name) return { message: "auth.validation.nameRequired" };
	if (!password) return { message: "auth.validation.passwordRequired" };
	if (!kind) return { message: "auth.validation.kindRequired" };
	if (!isAllowedRole(kind)) {
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
	const payload = {
		[User_Name]: data[User_Name],
		[User_HashedPassword]: hashedPassword,
		[User_Kind]: normalizeKind(data[User_Kind]),
		[User_IsActive]: data[User_IsActive] ?? true,
	};
	return await User.create(payload);
};

export const post = async (req, res) => {
	try {
		const { [mdlUser]: User } = req.app.locals.db;
		const newUser = await addUser(req.body, User);
		res.status(St_CREATED).json({
			success: true,
			data: sanitizeUser(newUser),
			message: "user.success.created",
		});
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};

export const getAll = async (req, res) => {
	try {
		const { [mdlUser]: User } = req.app.locals.db;
		const users = await User.findAll({ attributes: { exclude: [User_HashedPassword] } });
		res.status(St_OK).json({
			success: true,
			data: users,
		});
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

export const put = async (req, res) => {
	try {
		const { [mdlUser]: User } = req.app.locals.db;
		const data = req.body;
		const user = await User.findByPk(data.id);
		if (!user) {
			return res.status(St_NOT_FOUND).json({ success: false, message: "user.error.notFound" });
		}
		const updates = {
			[User_Name]: data[User_Name] ?? user[User_Name],
			[User_Kind]: data[User_Kind] !== undefined ? normalizeKind(data[User_Kind]) : user[User_Kind],
			[User_IsActive]: data[User_IsActive] !== undefined ? data[User_IsActive] : user[User_IsActive],
		};
		if (data[User_Password]) {
			updates[User_HashedPassword] = await hashPassword(data[User_Password]);
		}
		await user.update(updates);
		res.status(St_OK).json({
			success: true,
			data: sanitizeUser(user),
			message: "user.success.updated",
		});
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};

export const remove = async (req, res) => {
	try {
		const { [mdlUser]: User } = req.app.locals.db;
		const id = Number(req.params.id);
		if (!Number.isInteger(id) || id <= 0) {
			return res.status(St_BAD_REQUEST).json({ success: false, message: "messages.error.IDNotProvided" });
		}
		if (id === RecUser_ID || id === Number(req.context?.user?.id)) {
			return res.status(St_BAD_REQUEST).json({ success: false, message: "user.error.cannotDeleteAdmin" });
		}
		const deletedCount = await User.destroy({ where: { [User_ID]: id } });
		if (deletedCount === 0) {
			return res.status(St_NOT_FOUND).json({ success: false, message: "user.error.notFound" });
		}
		return res.status(St_OK).json({
			success: true,
			data: id,
			message: "user.success.deleted",
		});
	} catch (err) {
		return res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};
