import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PageLoadingFallback from "../components/PageLoadingFallback.jsx";
import {
	CategoriesPage,
	CustomerMenuPage,
	Dashboard,
	LobbyPage,
	Login,
	MenuItemsPage,
	OrdersPage,
	SettingsPage,
	TablesPage,
	UsersPage,
	WaiterPage,
} from "./routePages.jsx";

const protectedPaths = [
	{
		path: "/",
		index: true,
		label: "dashboard.title",
		icon: "Dashboard",
		element: <Dashboard />,
	},
	{
		path: "/categories",
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
		path: "/orders",
		label: "orders.title",
		icon: "ReceiptLong",
		element: <OrdersPage />,
	},
	{
		path: "/waiter",
		label: "waiter.title",
		icon: "Person",
		element: <WaiterPage />,
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

export const getSidebarMenu = (forms = []) => {
	if (!Array.isArray(forms)) return [];
	return forms
		.map((form) => {
			const route = protectedPaths.find((item) => item.path.toLowerCase() === String(form.path || "").toLowerCase());
			return route ? { path: route.path, icon: route.icon, label: route.label } : null;
		})
		.filter(Boolean);
};

export const router = createBrowserRouter([
	{
		path: "/login",
		element: (
			<Suspense fallback={<PageLoadingFallback />}>
				<Login />
			</Suspense>
		),
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
