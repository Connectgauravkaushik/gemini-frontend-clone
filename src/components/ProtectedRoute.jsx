import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
