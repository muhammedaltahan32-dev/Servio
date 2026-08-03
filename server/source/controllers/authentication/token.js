const SECRET = process.env.APP_SECRET || "AHMAD_SECRET";

export const generateToken = (userId) => {
	const timestamp = Date.now();
	const payload = `${userId}:${timestamp}:${SECRET}`;
	return Buffer.from(payload).toString("base64");
};

export const verifyToken = (token) => {
	try {
		const decoded = Buffer.from(token, "base64").toString("utf8");
		const [userId, timestamp, secret] = decoded.split(":");
		if (secret !== SECRET) return null;
		// Optional expiration: 1 day
		// 1000 x 3600 x 24 = 864000000
		if (Date.now() - parseInt(timestamp) > 864000000) return null;
		return { userId };
	} catch {
		return null;
	}
};
