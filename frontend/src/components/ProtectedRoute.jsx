// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if the user has a token in localStorage
  const isAuthenticated = !!localStorage.getItem("userToken");

  // If they are logged in, render the child routes (<Outlet />)
  // If not, redirect them to the /auth page
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;