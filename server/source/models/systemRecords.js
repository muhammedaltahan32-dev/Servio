import { User_ID, User_Kind, User_Name, User_Password } from "../../../constants/FieldsName.js";

export const RecConfig_ID = 1;
export const RecUser_ID = 1;

import { mdlUser } from "../../../constants/modelNames.js";
import { hashPassword } from "../controllers/authentication/hashPassword.js";

const systemRecords = async (models) => {
	const User = models[mdlUser];
	const hashedPassword = hashPassword("admin");
	const userRecords = {
		[User_ID]: RecUser_ID,
		[User_Name]: "admin",
		[User_Password]: hashedPassword,
		[User_Kind]: 1,
	};

	try {
		const adminRecord = await User.findOne({
			where: {
				[User_ID]: RecUser_ID,
			},
			attributes: [User_Kind],
		});
		if (!adminRecord) {
			await User.create(userRecords);
		}

		console.log("System records seeding completed");
	} catch (error) {
		console.error("Error seeding system records:", error);
	}
};

export default systemRecords;
