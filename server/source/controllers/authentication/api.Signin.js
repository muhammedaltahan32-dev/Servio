import { generateToken } from "./token.js";
import { Api_Signin } from "../../../../constants/SubApi.js";
import { getForms } from "./helper.js";
import { St_UNAUTHORIZED, St_OK } from "../../../../constants/HttpStatus.js";
import { mdlUser } from "../../../../constants/modelNames.js";
import { verifyPassword } from "./hashPassword.js";

export const subapi = Api_Signin;

const validateInput = (data) => {
	const { name, password } = data;
	if (!name) return "messages.errors.signin.fieldRequired.Name";
	if (!password) return "messages.errors.signin.fieldRequired.Password";
	return null;
};

const signin = async (data, User) => {
	const validationError = validateInput(data);
	if (validationError) {
		throw new Error(validationError);
	}
	const { name, password } = data;
	const user = await User.findOne({ where: { name } });
	const isValidPassword = user ? await verifyPassword(password, user.password) : false;
	if (!user || !isValidPassword) {
		throw new Error("messages.errors.signin.athuError");
	}
	const token = generateToken(user.id);
	return { token, user };
};

export const post = async (req, res) => {
	try {
		const { [mdlUser]: User } = req.app.locals.db;
		const { token, user } = await signin(req.body, User);
		const forms = getForms(user.kind);
		return res.status(St_OK).json({ token, forms });
	} catch (err) {
		return res.status(St_UNAUTHORIZED).json({ message: err.message });
	}
};
