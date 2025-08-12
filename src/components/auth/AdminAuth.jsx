import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";
import storeAuth from "../../context/storeAuth.jsx";

// Componente para el formulario de login del administrador
const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { fetchDataBackend } = useFetch();
  const API_URL = import.meta.env.VITE_API_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Llama al endpoint de login con los datos del formulario
      const response = await fetchDataBackend(
        `${API_URL}/admins/login`,
        data,
        "POST"
      );

      storeAuth.getState().login(response.token, response);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));

      toast.success("Login de administrador exitoso!");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error("Error en el login:", error);
      toast.error(
        error.message || "Error con el servidor. Inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div>
          <Link
            to="/"
            className="flex items-center text-blue-velvet/80 mb-6 hover:text-blue-800 hover:scale-105 transition-transform duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Ir a la Web
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Panel de Administrador
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "El email es requerido" })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "La contraseña es requerida",
              })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="adminCode"
              className="block text-sm font-medium text-gray-700"
            >
              Código de Administrador
            </label>
            <input
              id="adminCode"
              type="password"
              {...register("adminCode", {
                required: "El código de administrador es requerido",
              })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.adminCode && (
              <p className="mt-2 text-sm text-red-600">
                {errors.adminCode.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/admin/password/recover"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
};

// Componente para el formulario de recuperación de contraseña del administrador
const AdminForgotPassword = () => {
  const { fetchDataBackend } = useFetch();
  const API_URL = import.meta.env.VITE_API_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetchDataBackend(
        `${API_URL}/admins/password/recover`,
        data,
        "POST"
      );
      toast.success(
        response?.msg ||
          "Si el email está registrado, se ha enviado un correo para restablecer la contraseña."
      );
      navigate("/admin/login");
    } catch (error) {
      toast.error(error.message || "Error con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Recuperar Contraseña
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email del Administrador
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "El email es requerido" })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
          >
            {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/admin/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
};

// Componente para el restablecimiento de contraseña del administrador
const AdminResetPassword = () => {
  const { fetchDataBackend } = useFetch();
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [tokenStatus, setTokenStatus] = useState("validating"); // "validating", "valid", "invalid"
  const [loading, setLoading] = useState(false);
  const password = watch("password", "");

  // Efecto para validar el token cuando se carga el componente
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Llama al endpoint de verificación de token
        const response = await fetchDataBackend(
          `${API_URL}/admins/password/verify/${token}`,
          null,
          "GET"
        );
        toast.success(
          response?.msg ||
            "Token verificado con éxito. Puedes crear tu nueva contraseña."
        );
        setTokenStatus("valid");
      } catch (error) {
        toast.error(
          error.message || "Lo sentimos, el token no es válido o ha expirado."
        );
        setTokenStatus("invalid");
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenStatus("invalid");
      toast.error("Token no encontrado en la URL.");
    }
  }, [token, fetchDataBackend, API_URL]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Llama al endpoint de restablecimiento de contraseña
      const response = await fetchDataBackend(
        `${API_URL}/admins/password/reset/${token}`,
        data,
        "POST"
      );
      toast.success(
        response?.msg || "Contraseña restablecida con éxito. Inicia sesión."
      );
      navigate("/admin/login");
    } catch (error) {
      toast.error(
        error.message ||
          "No se pudo restablecer la contraseña. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Restablecer Contraseña
        </h2>

        {tokenStatus === "validating" && (
          <p className="text-center text-gray-600">Validando token...</p>
        )}

        {tokenStatus === "invalid" && (
          <div className="text-center">
            <p className="text-red-500 mb-4">
              El enlace para restablecer la contraseña no es válido o ha
              expirado.
            </p>
            <Link
              to="/admin/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Volver al Login
            </Link>
          </div>
        )}

        {tokenStatus === "valid" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nueva Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Nueva Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "La confirmación de la contraseña es requerida",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
            >
              {loading ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export { AdminLoginPage, AdminForgotPassword, AdminResetPassword };
