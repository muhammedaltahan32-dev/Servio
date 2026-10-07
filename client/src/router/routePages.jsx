import React, { lazy } from "react";

export const Home = lazy(() => import("../pages/home/Home.jsx"));
export const Login = lazy(() => import("../pages/login/Login.jsx"));
export const CategoriesPage = lazy(() => import("../pages/categories/CategoriesPage.jsx"));
export const LobbyPage = lazy(() => import("../pages/Lobby/LobbyPage.jsx"));
export const TablesPage = lazy(() => import("../pages/tables/TablesPage.jsx"));
export const MenuItemsPage = lazy(() => import("../pages/menuItems/MenuItemsPage.jsx"));
export const UsersPage = lazy(() => import("../pages/users/UsersPage.jsx"));
export const CustomerMenuPage = lazy(() => import("../pages/menu/CustomerMenuPage.jsx"));
export const SettingsPage = lazy(() => import("../pages/settings/SettingsPage.jsx"));
export const OrdersPage = lazy(() => import("../pages/orders/OrdersPage.jsx"));
