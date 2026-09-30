import { User_Kind } from "../../../../constants/FieldsName.js";
import { St_BAD_REQUEST, St_CREATED, St_UNAUTHORIZED } from "../../../../constants/HttpStatus.js";
import { mdlUser } from "../../../../constants/modelNames.js";
import { Api_Architecture } from "../../../../constants/SubApi.js";
import { getForms } from "./helper.js";
import { generateToken, verifyToken } from "./token.js";

export const subapi = Api_Architecture;

const refresh = async (req, res) => {
	try {
		const db = req.app.locals.db;
		const authHeader = req.headers?.authorization;
		const token = authHeader?.split(" ")[1];
		const currentToken = verifyToken(token, "refresh");
		if (!currentToken?.userId) {
			return res.status(St_UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
		}

		const user = await db[mdlUser].findByPk(currentToken.userId);
		if (!user) {
			return res.status(St_UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
		}

		const newToken = generateToken(user.id, { type: "access" });
		const newRefreshToken = generateToken(user.id, { type: "refresh" });
		const forms = getForms(user[User_Kind]);

		return res.status(St_CREATED).json({
			success: true,
			data: {
				forms,
				token: newToken,
				refreshToken: newRefreshToken,
			},
		});
	} catch (err) {
		return res.status(St_BAD_REQUEST).json({ success: false, message: err.message });
	}
};

export const register = (app) => {
	app.post(`/${Api_Architecture}/refresh`, refresh);
};

export const get = refresh;
