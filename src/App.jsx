import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import storeAuth from './context/storeAuth.jsx';

import Home from './pages/Home/Home.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import EmailConfirmation from './pages/Auth/EmailConfirmation.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import ResetPassword from './pages/Auth/ResetPassword.jsx';
import EmployeeDashboard from './pages/Dashboard/Employe/EmployeeDashboard.jsx';
import AdminDashboard from './pages/Dashboard/Owner/AdminDashboard.jsx';

import PublicRoute from './routes/PublicRoute.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const redirectPath = query.get('p');
        
        if (redirectPath) {
            const decodedPath = decodeURIComponent(redirectPath.replace(/~and~/g, '&'));
            navigate(decodedPath, { replace: true });
        }
    }, [location.search, navigate]);

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
                </Route>

                {/* Rutas protegidas */}
                <Route element={<ProtectedRoute allowedRoles={['jefe']} />}>
                    <Route path="/dashboard/admin" element={<AdminDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['empleado']} />}>
                    <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
                </Route>

                {/* Redirección según rol */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Routes>
                            <Route index element={
                                storeAuth.getState().user?.rol === 'jefe' 
                                    ? <Navigate to="/dashboard/admin" replace /> 
                                    : <Navigate to="/dashboard/employee" replace />
                            } />
                        </Routes>
                    </ProtectedRoute>
                } />

                {/* Ruta de fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <ToastContainer
                position="top-center"
                autoClose={5000}
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