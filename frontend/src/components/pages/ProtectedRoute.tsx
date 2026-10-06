
import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiry");
    if (expiry && Date.now() > Number(expiry)) { localStorage.removeItem("token"); localStorage.removeItem("expiry"); return <Navigate to="/signin" replace />; }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
