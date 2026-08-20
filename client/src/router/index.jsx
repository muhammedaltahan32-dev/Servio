import { createBrowserRouter, Navigate } from "react-router-dom";

import { Home, Login, NotFound } from "@pages";
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
