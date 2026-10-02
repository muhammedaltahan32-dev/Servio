import { createBrowserRouter } from "react-router-dom";
import {
	Home,
	Login,
	CategoriesPage,
	LobbyPage,
	TablesPage,
	MenuItemsPage,
	UsersPage,
	CustomerMenuPage,
} from "@pages";
import ProtectedRoute from "./ProtectedRoute.jsx";

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
];

export const sidebarMenu = protectedPaths.map(({ path, icon, label }) => ({ path, icon, label }));

export const router = createBrowserRouter([
	{
		path: "/login",
		element: <Login />,
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
