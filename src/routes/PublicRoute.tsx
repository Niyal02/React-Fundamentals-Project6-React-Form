import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isAuthenticated = localStorage.getItem("accessToken");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
