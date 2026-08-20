import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Root from "../layout/Root.jsx";

export const ProtectedRoute = () => {
	const { isAuthenticated } = useSelector((state) => state.auth);

	// return isAuthenticated ? <Root /> : <Navigate to="/login" replace />;
	return <Root />;
};

export default ProtectedRoute;
