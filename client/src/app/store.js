import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice.js";
import authReducer from "../features/auth/authSlice.js";
import langSlice from "../features/lang/langSlice.js";
import layoutSlice from "../features/layout/layoutSlice.js";

export const store = configureStore({
	reducer: {
		theme: themeReducer,
		auth: authReducer,
		language: langSlice,
		layout: layoutSlice,
	},
});
