import { User_Kind } from "../../../../constants/FieldsName.js";
import { St_BAD_REQUEST, St_CREATED } from "../../../../constants/HttpStatus.js";
import { mdlUser } from "../../../../constants/modelNames.js";
import { Api_Architecture } from "../../../../constants/SubApi.js";
import { getForms } from "./helper.js";
import { generateToken, verifyToken } from "./token.js";

export const subapi = Api_Architecture;

export const get = async (req, res) => {
	try {
		const db = req.app.locals.db;
		const rolues = req.context.rolues;
		const authHeader = req.headers?.authorization;

		let newToken;
		const token = authHeader?.split(" ")[1];
		if (token) {
			const resToken = verifyToken(token);
			if (resToken?.userId) {
				newToken = generateToken(resToken.userId);
			}
		}
		const user = await db[mdlUser].findByPk(req.context.user?.id);
		const forms = getForms(user[User_Kind], rolues);

		res.status(St_CREATED).json({
			forms,
			token: newToken,
		});
	} catch (err) {
		res.status(St_BAD_REQUEST).json({ message: err.message });
	}
};

