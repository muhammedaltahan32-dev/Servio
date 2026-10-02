import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PageLoadingFallback from "../components/PageLoadingFallback.jsx";
import {
	CategoriesPage,
	CustomerMenuPage,
	Home,
	LobbyPage,
	Login,
	MenuItemsPage,
	SettingsPage,
	TablesPage,
	UsersPage,
} from "./routePages.jsx";

const protectedPaths = [
	{
		path: "/",
		index: true,
		label: "home.title",
		icon: "Home",
		element: <Home />,
	},
	{
		path: "/Categories",
		label: "categories.title",
		icon: "Category",
		element: <CategoriesPage />,
	},
	{
		path: "/lobby",
		label: "lobby.title",
		icon: "TableBarTwoTone",
		element: <LobbyPage />,
	},
	{
		path: "/tables",
		label: "tables.title",
		icon: "TableRestaurant",
		element: <TablesPage />,
	},
	{
		path: "/users",
		label: "users.title",
		icon: "People",
		element: <UsersPage />,
	},
	{
		path: "/menu-items",
		label: "menuItems.title",
		icon: "RestaurantMenu",
		element: <MenuItemsPage />,
	},
	{
		path: "/customer-menu",
		label: "customerMenu.title",
		icon: "RestaurantMenu",
		element: <CustomerMenuPage />,
	},
	{
		path: "/settings",
		label: "settings.title",
		icon: "Settings",
		element: <SettingsPage />,
	},
];

export const sidebarMenu = protectedPaths.map(({ path, icon, label }) => ({ path, icon, label }));

export const router = createBrowserRouter([
	{
		path: "/login",
		element: <Suspense fallback={<PageLoadingFallback />}><Login /></Suspense>,
	},
	{
		path: "/",
		element: <ProtectedRoute />,
		children: [
			...protectedPaths,
			{
				path: "/customer-menu/:tableId",
				element: <CustomerMenuPage />,
			},
		],
	},
]);
