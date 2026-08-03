import crypto from "crypto";

export const hashPassword = (password) => {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
	return `${salt}:${hash}`;
};

export const verifyPassword = async (password, hashedPassword) => {
	try {
		if (!hashedPassword || !hashedPassword.includes(":")) {
			return false;
		}
		const parts = hashedPassword.split(":");
		if (parts.length < 2) {
			return false;
		}
		const salt = parts[0];
		const hash = parts[1];
		if (!salt || !hash) {
			return false;
		}
		const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
		return hash === verifyHash;
	} catch (error) {
		return false;
	}
};
