import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice.js";
import authReducer from "../features/auth/authSlice.js";
import accountReducer from "../features/account/accountSlice.js";
import langSlice from "../features/lang/langSlice.js";

export const store = configureStore({
	reducer: {
		theme: themeReducer,
		auth: authReducer,
		account: accountReducer,
		language:langSlice
	},
});
