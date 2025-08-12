import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import storeAuth from "../context/storeAuth";

const PublicRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [redirectPath, setRedirectPath] = useState('');

    useEffect(() => {
        // Obtenemos los datos del store una sola vez
        const { token, user } = storeAuth.getState();
        
        if (token) {
            const path = user?.rol === 'jefe' ? '/dashboard/admin' : '/dashboard/employee';
            setRedirectPath(path);
            setShouldRedirect(true);
        }
        
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return null;
    }

    if (shouldRedirect) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;