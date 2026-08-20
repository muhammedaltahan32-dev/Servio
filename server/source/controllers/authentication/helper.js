import { Kind_ADMIN, Kind_KITCHEN, Kind_WAITER } from "../../../../constants/enumOptions.js";
import { admin, waiter, kitchen } from "../../authentication/context.js";
import { verifyToken } from "./token.js";

export const getForms = (kind, rolues) => {
	let roleConfig;
	if (!rolues) {
		switch (kind) {
			case 1:
			case Kind_ADMIN:
				roleConfig = admin;
				break;
			case 2:
			case Kind_WAITER:
				roleConfig = waiter;
				break;
			case 3:
			case Kind_KITCHEN:
				roleConfig = kitchen;
				break;
			default:
				roleConfig = {};
		}
	} else roleConfig = rolues;

	return Object.entries(roleConfig)
		.filter(([_, perms]) => perms.open === true)
		.map(([key]) => key);
};

export const getUserIdFromReq = (req) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) throw new Error("Unauthorized");
	const token = authHeader.split(" ")[1];
	const user = verifyToken(token);
	if (user) {
		return parseInt(user.userId);
	} else return { message: "error.messages.ExpiredToken" };
};
