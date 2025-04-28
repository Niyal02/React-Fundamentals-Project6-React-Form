import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isAuthenticated = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  return isAuthenticated && role === "admin" ? (
    <Navigate to="/user/dashboard" />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
