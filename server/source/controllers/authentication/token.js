import jwt from "jsonwebtoken";

// if (!process.env.APP_SECRET) {
// 	throw new Error("FATAL: APP_SECRET environment variable is not defined.");
// }

const SECRET = process.env.APP_SECRET || "AHMAD-SECRET-KEY";

const ACCESS_TOKEN_TTL = 1 * 60;
const REFRESH_TOKEN_TTL = 7 * 24;

export const generateToken = (userId, options = {}) => {
	const { type = "access", ttl = type === "refresh" ? REFRESH_TOKEN_TTL : ACCESS_TOKEN_TTL } = options;

	const payload = {
		userId,
		type,
	};

	return jwt.sign(payload, SECRET, {
		expiresIn: ttl,
	});
};

export const verifyToken = (token, expectedType = "access") => {
	try {
		const decoded = jwt.verify(token, SECRET);

		if (expectedType && decoded.type !== expectedType) {
			return null;
		}

		return {
			userId: decoded.userId,
			type: decoded.type,
			exp: decoded.exp * 1000,
		};
	} catch (error) {
		return null;
	}
};
