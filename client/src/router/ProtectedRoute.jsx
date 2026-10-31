import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Root from "../layout/Root.jsx";

export const ProtectedRoute = () => {
	const { isAuthenticated, token } = useSelector((state) => state.auth);
	const forms = useSelector((state) => state.auth.user?.forms ?? []);
	const location = useLocation();
	if (!token || !isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}
	if (location.pathname === "/" && !forms.some((form) => form.path === "/")) {
		const firstAllowedPage = forms.find((form) => form.path && form.path !== "/login")?.path;
		return <Navigate to={firstAllowedPage || "/login"} replace />;
	}
	return <Root />;
};

export default ProtectedRoute;
