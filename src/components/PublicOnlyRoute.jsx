import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import FullPageLoader from "./FullPageLoader";

const PublicOnlyRoute = ({ children }) => {
  const { user, authChecked } = useSelector(state => state.auth);

  if (!authChecked) {
    return <FullPageLoader text="Checking session…" />;
  }

  if (user) {
    if (!user.emailVerified) {
      return <Navigate to="/verify-email" replace />;
    }

    if (!user.phoneVerified) {
      return <Navigate to="/verify-otp" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicOnlyRoute;