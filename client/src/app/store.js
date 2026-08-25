import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice.js";
import authReducer from "../features/auth/authSlice.js";
import accountReducer from "../features/account/accountSlice.js";
import langSlice from "../features/lang/langSlice.js";
import layoutSlice from "../features/layout/layoutSlice.js";
import categoriesReducer from "../features/categories/CategoriesSlice.js";
import tablesReducer from "../features/tables/TablesSlice.js";

export const store = configureStore({
	reducer: {
		theme: themeReducer,
		auth: authReducer,
		account: accountReducer,
		language: langSlice,
		layout: layoutSlice,
		categories: categoriesReducer,
		tables: tablesReducer,
	},
});
