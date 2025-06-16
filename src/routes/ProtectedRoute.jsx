import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import storeAuth from "../context/storeAuth";

const ProtectedRoute = ({ allowedRoles }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Obtenemos los datos del store una sola vez
        const { token, user } = storeAuth.getState();
        setIsAuthenticated(!!token);
        setUserRole(user?.rol);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return null; // O un spinner de carga
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        const redirectPath = userRole === 'jefe' ? '/dashboard/admin' : '/dashboard/employee';
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;