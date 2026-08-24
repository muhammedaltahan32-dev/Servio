import { createBrowserRouter, Navigate } from "react-router-dom";

import { Home, Login, NotFound, CategoriesPage, Test, LobbyPage } from "@pages";
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
		path: "/Test",
		label: "Test",
		icon: "Table",
		element: <Test />,
	},
	{
		path: "lobby",
		label: "lobby",
		icon: "TableRestaurant",
		element: <LobbyPage />,
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
