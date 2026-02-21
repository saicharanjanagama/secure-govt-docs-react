import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./utils/firebase";
import { auth } from "./utils/firebase";
import { setUser, clearUser } from "./features/auth/authSlice";
import { mapFirebaseUser } from "./utils/mapUser";

import GlobalStyles from "./styles/GlobalStyles";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import FullPageLoader from "./components/FullPageLoader";
// import { logAction } from "./utils/logger";

/* ---------- LAZY LOADED PAGES ---------- */
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const Login = lazy(() => import("./features/auth/Login"));
const Register = lazy(() => import("./features/auth/Register"));
const MyProfile = lazy(() => import("./features/profile/MyProfile"));
const SharedDocuments = lazy(() => import("./features/documents/SharedDocuments"));
const VerifyEmail = lazy(() => import("./features/auth/VerifyEmail"));
const VerifyOtp = lazy(() => import("./features/auth/VerifyOtp"));

/* ---------- SMART ROOT REDIRECT ---------- */
const HomeRedirect = () => {
  const { user, authChecked } = useSelector(state => state.auth);

  if (!authChecked) {
    return <FullPageLoader text="Checking session…" />;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (!user.phoneVerified) {
    return <Navigate to="/verify-otp" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        const firestoreData = snap.exists() ? snap.data() : {};

        dispatch(setUser(mapFirebaseUser(user, firestoreData)));
      } else {
        dispatch(clearUser());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <Router>
      <GlobalStyles />
      <Navbar />

      <Suspense fallback={<FullPageLoader text="Loading page…" />}>
        <Routes>
          {/* ROOT */}
          <Route path="/" element={<HomeRedirect />} />

          {/* PUBLIC ROUTES */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          {/* EMAIL VERIFICATION */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shared"
            element={
              <ProtectedRoute>
                <SharedDocuments />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;