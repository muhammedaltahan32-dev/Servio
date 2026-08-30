import { mdlUser } from "../../../constants/modelNames.js";
import { Kind_ADMIN, Kind_WAITER, Kind_KITCHEN } from "../../../constants/enumOptions.js";
import { Api_Category, Api_Signin, Api_Table, Api_User } from "../../../constants/SubApi.js";
import { User_ID, User_Kind } from "../../../constants/FieldsName.js";
import { getUserIdFromReq } from "../controllers/authentication/helper.js";

export const admin = {
	[Api_User]: { post: true, put: true, get: true, getAll: true, getOne: true, remove: true, patch: true },
	[Api_Table]: { post: true, put: true, get: true, getAll: true, getOne: true, remove: true, patch: true },
	[Api_Category]: { post: true, put: true, get: true, getAll: true, getOne: true, remove: true, patch: true },
	[Api_Signin]: { post: true },
};

export const waiter = {
	[Api_Signin]: { post: true },
};

export const kitchen = {
	[Api_Signin]: { post: true },
};

export const guests = {
	[Api_Signin]: { post: true },
};

class Context {
	#rolues;
	#user;
	constructor(rolues, user = null) {
		this.#rolues = rolues;
		this.#user = user;
	}

	hasPermission(resource, method) {
		if (!this.#rolues) return false;
		const res = this.#rolues[resource];
		if (!res) return false;
		return !!res[method];
	}

	get rolues() {
		return this.#rolues;
	}

	get user() {
		return this.#user;
	}
}

export default async function assignContext(req, res, next) {
	try {
		const authHeader = req.headers.authorization;
		let role = guests;
		let userObj = null;

		if (authHeader) {
			const userId = getUserIdFromReq(req);
			if (userId && !userId.message) {
				userObj = { id: userId };

				const userModel = req.app.locals.db[mdlUser];
				const foundUser = await userModel.findOne({
					where: { [User_ID]: userId },
					attributes: [User_Kind],
				});
				if (foundUser) {
					const roleMap = {
						[Kind_ADMIN]: admin,
						[Kind_KITCHEN]: kitchen,
						[Kind_WAITER]: waiter,
					};
					role = roleMap[foundUser.kind] || guests;
				}
			}
		}
		req.context = new Context(role, userObj);
		next();
	} catch (error) {
		next(error);
	}
}
