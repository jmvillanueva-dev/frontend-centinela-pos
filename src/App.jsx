import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import storeAuth from "./context/storeAuth.jsx";

// Importa los nuevos componentes de autenticación de administrador
import {
  AdminLoginPage,
  AdminForgotPassword,
  AdminResetPassword,
} from "./components/Auth/AdminAuth.jsx";

// Importa el nuevo componente principal del dashboard de administrador
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard.jsx";

import Home from "./pages/Home/Home.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import EmailConfirmation from "./pages/Auth/EmailConfirmation.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import EmployeeDashboard from "./pages/Dashboard/Employe/EmployeeDashboard.jsx";
import OwnerDashboard from "./pages/Dashboard/Owner/OwnerDashboard.jsx";
import GoogleAuthCallback from "./pages/Auth/GoogleAuthCallback.jsx";
import {
  UpgradePlanPage,
  PaymentResultPage,
} from "./pages/Dashboard/Owner/SubscriptionPlans.jsx";

import PublicRoute from "./routes/PublicRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const redirectPath = query.get("p");
    const queryParams = query.get("q");

    if (redirectPath) {
      const decodedPath = decodeURIComponent(
        redirectPath.replace(/~and~/g, "&")
      );
      const fullPath = queryParams
        ? `${decodedPath}?${queryParams.replace(/~and~/g, "&")}`
        : decodedPath;

      navigate(fullPath, { replace: true });
    }
  }, [location.search, navigate]);

  const userRole = storeAuth.getState().user?.rol;

  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirm/:rol/:token" element={<EmailConfirmation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleAuthCallback />}
          />

          {/* Nuevas rutas de administración (públicas) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/password/recover"
            element={<AdminForgotPassword />}
          />
          <Route
            path="/admin/password/reset/:token"
            element={<AdminResetPassword />}
          />
        </Route>

        {/* Rutas protegidas para rol 'jefe' */}
        <Route element={<ProtectedRoute allowedRoles={["jefe"]} />}>
          <Route path="/dashboard/admin" element={<OwnerDashboard />} />{" "}
          {/* Aquí usa el dashboard de jefe si es necesario */}
          <Route path="/dashboard/upgrade-plan" element={<UpgradePlanPage />} />
          <Route
            path="/dashboard/upgrade-plan/result"
            element={<PaymentResultPage />}
          />
        </Route>

        {/* Rutas protegidas para rol 'empleado' */}
        <Route element={<ProtectedRoute allowedRoles={["empleado"]} />}>
          <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
        </Route>

        {/* Rutas protegidas para rol 'administrador' */}
        <Route element={<ProtectedRoute allowedRoles={["administrador"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Redirección del dashboard principal */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {userRole === "jefe" ? (
                <Navigate to="/dashboard/admin" replace />
              ) : userRole === "empleado" ? (
                <Navigate to="/dashboard/employee" replace />
              ) : userRole === "administrador" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        />

        {/* Ruta de fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
