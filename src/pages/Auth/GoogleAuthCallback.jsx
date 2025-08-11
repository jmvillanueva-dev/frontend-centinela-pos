import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import storeAuth from "../../context/storeAuth.jsx";

/**
 * @component GoogleAuthCallback
 * @description Componente para manejar la redirección del callback de Google.
 * Lee los parámetros de la URL, almacena los datos de autenticación y redirige al dashboard.
 */

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Extraer los parámetros de la URL
    const token = searchParams.get("token");
    const userDataParam = searchParams.get("user");

    if (token && userDataParam) {
      try {
        // Decodificar el parámetro de la URL antes de analizarlo como JSON
        const dataFromBackend = JSON.parse(decodeURIComponent(userDataParam));

        // Acceder a los datos del usuario que ahora están anidados dentro de la propiedad 'jefe'
        const userData = dataFromBackend.jefe;

        // Almacenar el token y los datos del usuario en el store de Zustand
        // Pasamos el objeto 'userData' (el jefe) directamente
        storeAuth.getState().login(token, userData);

        // Persistir los datos en localStorage para mantener la sesión
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        toast.success(`Bienvenido ${userData.nombres} ${userData.apellidos}`);

        // Redirigir según el rol recibido
        const redirectPath =
          userData.rol === "jefe" ? "/dashboard/admin" : "/dashboard/employee";

        // Limpiar los parámetros de la URL y navegar, reemplazando la entrada del historial
        navigate(redirectPath, { replace: true });
      } catch (error) {
        console.error("Error al procesar los datos de Google:", error);
        // El error puede ser un JSON inválido, un URI malformado u otro problema de procesamiento
        toast.error(
          "Hubo un problema al procesar los datos de autenticación. Por favor, inténtalo de nuevo."
        );

        navigate("/login", { replace: true });
      }
    } else {
      toast.error("No se pudieron obtener los datos de autenticación.");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex items-center space-x-2">
        <svg
          className="animate-spin h-5 w-5 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-gray-700">Procesando autenticación...</span>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
