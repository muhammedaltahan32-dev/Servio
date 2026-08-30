import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import accountReducer from "../features/account/accountSlice.js";
import langSlice from "../features/lang/langSlice.js";
import layoutSlice from "../features/layout/layoutSlice.js";
import categoriesReducer from "../features/categories/CategoriesSlice.js";
import tablesReducer from "../features/tables/TablesSlice.js";
import menuItemsReducer from "../features/menuItems/MenuItemsSlice.js";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		account: accountReducer,
		language: langSlice,
		layout: layoutSlice,
		categories: categoriesReducer,
		tables: tablesReducer,
		menuItems: menuItemsReducer,
	},
});
