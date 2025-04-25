import { Navigate, Outlet } from "react-router-dom";

type PrivateRouteProps = {
  requiredRole?: "admin" | "user";
};

const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
  const isAuthenticated = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role") as "admin" | "user";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  // return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
  return <Outlet />;
};

export default PrivateRoute;
