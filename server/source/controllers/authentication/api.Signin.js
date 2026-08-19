import { generateToken } from "./token.js";
import { Api_Signin } from "../../../../constants/SubApi.js";
import { getForms } from "./helper.js";
import { St_UNAUTHORIZED, St_OK } from "../../../../constants/HttpStatus.js";
import { mdlUser } from "../../../../constants/modelNames.js";
import { verifyPassword } from "./hashPassword.js";
import { User_Name, User_Password, User_HashedPassword } from "../../../../constants/FieldsName.js";

export const subapi = Api_Signin;

const validateInput = (data) => {
	const { [User_Name]: name, [User_Password]: password } = data;
	if (!name) return "auth.validation.nameRequired";
	if (!password) return "auth.validation.passwordRequired";
	return null;
};

const signin = async (data, User) => {
	const validationError = validateInput(data);
	if (validationError) {
		throw new Error(validationError);
	}
	const { [User_Name]: name, [User_Password]: password } = data;
	const user = await User.findOne({ where: { [User_Name]: name } });
	const isValidPassword = user ? await verifyPassword(password, user[User_HashedPassword]) : false;
	if (!user || !isValidPassword) {
		throw new Error("auth.error.invalidCredentials");
	}
	const token = generateToken(user.id);
	return { token, user };
};

export const post = async (req, res) => {
	try {
		const { [mdlUser]: User } = req.app.locals.db;
		const { token, user } = await signin(req.body, User);
		const forms = getForms(user.kind);
		return res.status(St_OK).json({ sucess: true, token, forms });
	} catch (err) {
		return res.status(St_UNAUTHORIZED).json({ sucess: false, error: err.message });
	}
};

