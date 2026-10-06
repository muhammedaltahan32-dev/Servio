import { generateToken } from "./token.js";
import { Api_Signin } from "../../../../constants/SubApi.js";
import { getForms } from "./helper.js";
import { St_UNAUTHORIZED, St_OK, St_TOO_MANY_REQUESTS } from "../../../../constants/HttpStatus.js";
import { mdlUser } from "../../../../constants/modelNames.js";
import { verifyPassword } from "./hashPassword.js";
import { User_HashedPassword, User_Kind, User_Name, User_Password } from "../../../../constants/FieldsName.js";

export const subapi = Api_Signin;

const MAX_LOGIN_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const loginAttemptsByIp = new Map();

const validateInput = (data) => {
	const { [User_Name]: name, [User_Password]: password } = data;
	if (!name) return "auth.validation.nameRequired";
	if (!password) return "auth.validation.passwordRequired";
	return null;
};

const getLoginAttempt = (ip, now = Date.now()) => {
	const attempt = loginAttemptsByIp.get(ip);
	if (!attempt) return null;

	if ((attempt.lockedUntil && attempt.lockedUntil <= now) || (!attempt.lockedUntil && attempt.expiresAt <= now)) {
		loginAttemptsByIp.delete(ip);
		return null;
	}

	return attempt;
};

const recordFailedAttempt = (ip, now = Date.now()) => {
	const current = getLoginAttempt(ip, now);
	const failures = (current?.failures ?? 0) + 1;
	const attempt = {
		failures,
		expiresAt: current?.expiresAt ?? now + ATTEMPT_WINDOW_MS,
		lockedUntil: failures >= MAX_LOGIN_ATTEMPTS ? now + ATTEMPT_WINDOW_MS : null,
	};
	loginAttemptsByIp.set(ip, attempt);
	return attempt;
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
	const token = generateToken(user.id, { type: "access" });
	const refreshToken = generateToken(user.id, { type: "refresh" });
	return { token, refreshToken, user };
};

export const post = async (req, res) => {
	const ip = req.ip;
	const now = Date.now();
	const attempt = getLoginAttempt(ip, now);
	if (attempt?.lockedUntil) {
		return res.status(St_TOO_MANY_REQUESTS).json({
			success: false,
			message: "auth.error.tooManyAttempts",
		});
	}

	try {
		const { [mdlUser]: User } = req.app.locals.db;
		const { token, refreshToken, user } = await signin(req.body, User);
		loginAttemptsByIp.delete(ip);
		const forms = getForms(user[User_Kind]);
		return res.status(St_OK).json({ success: true, data: { token, refreshToken, forms } });
	} catch (err) {
		if (err.message === "auth.error.invalidCredentials") {
			const failedAttempt = recordFailedAttempt(ip);
			if (failedAttempt.lockedUntil) {
				return res.status(St_TOO_MANY_REQUESTS).json({
					success: false,
					message: "auth.error.tooManyAttempts",
				});
			}
		}
		return res.status(St_UNAUTHORIZED).json({ success: false, message: err.message });
	}
};
