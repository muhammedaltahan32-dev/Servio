import { createBrowserRouter, Navigate } from "react-router-dom";

import { Home, Login, NotFound, CategoriesPage, LobbyPage, TablesPage, MenuItemsPage } from "@pages";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Root from "../layout/Root.jsx";

const protectedPaths = [
	{
		path: "/",
		index: true,
		label: "home",
		icon: "Home",
		element: <Home />,
	},
	{
		path: "/Categories",
		label: "Categories",
		icon: "Category",
		element: <CategoriesPage />,
	},
	{
		path: "/lobby",
		label: "lobby",
		icon: "TableBarTwoTone",
		element: <LobbyPage />,
	},
	{
		path: "/tables",
		label: "Tables",
		icon: "TableRestaurant",
		element: <TablesPage />,
	},
	{
		path: "/menu-items",
		label: "Menu Items",
		icon: "RestaurantMenu",
		element: <MenuItemsPage />,
	},
];
export const sidebarMenu = protectedPaths.map(({ path, icon, label }) => ({ path, icon, label }));
export const router = createBrowserRouter([
	{
		path: "login",
		element: <Login />,
	},
	{
		path: "/",
		element: <ProtectedRoute />,
		// errorElement: <NotFound />,
		children: protectedPaths,
	},
]);
