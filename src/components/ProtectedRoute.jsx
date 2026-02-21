import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import FullPageLoader from "./FullPageLoader";
import { useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, authChecked } = useSelector(state => state.auth);
  const location = useLocation();

  if (!authChecked) {
    return <FullPageLoader text="Checking session…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // ✅ IMPORTANT: do NOT redirect if already on verify-otp
  if (
    !user.phoneVerified &&
    location.pathname !== "/verify-otp"
  ) {
    return <Navigate to="/verify-otp" replace />;
  }

  return children;
};

export default ProtectedRoute;