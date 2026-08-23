import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Root from "../layout/Root.jsx";

export const ProtectedRoute = () => {
	const { isAuthenticated, token } = useSelector((state) => state.auth);
	const location = useLocation();
	if (!token || !isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}
	return <Root />;
};

export default ProtectedRoute;
