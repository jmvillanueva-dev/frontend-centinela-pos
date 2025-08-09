import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import useFetch from "../../hooks/useFetch.js";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import { User, Briefcase } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("owner");
  const [cedulaError, setCedulaError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const { fetchDataBackend } = useFetch();
  const cedulaValue = watch("cedula");

  useEffect(() => {
    if (cedulaValue && cedulaValue.length > 0) {
      const error = validateCedula(cedulaValue);
      setCedulaError(error === true ? null : error);
    } else {
      setCedulaError(null);
    }
  }, [cedulaValue]);

  const onSubmit = async (data) => {
    const cedulaValidation = validateCedula(data.cedula);
    if (cedulaValidation !== true) {
      setCedulaError(cedulaValidation);
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      if (!baseUrl) throw new Error("La URL de la API no está configurada");

      const requestData = {
        nombres: data.nombres.trim(),
        apellidos: data.apellidos.trim(),
        cedula: data.cedula.replace(/\D/g, ""),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        ...(role === "employee" && {
          companyCode: data.companyCode.toUpperCase().trim(),
        }),
      };

      const endpoint =
        role === "owner" ? "/boss/register" : "/employees/register";
      const response = await fetchDataBackend(
        `${baseUrl}${endpoint}`,
        requestData,
        "POST"
      );

      if (response && response.msg) {
        // Limpiar el formulario
        reset();
        setRole("owner");
        setShowPassword(false);
        setCedulaError(null);
        toast.success(response.msg);
      } else {
        throw new Error(response.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en onSubmit:", error);
      toast.error(error.message || "Error al registrar usuario");
    }
  };

  const validateCedula = (cedula) => {
    const cleanCedula = cedula.replace(/[- ]/g, "");

    if (cleanCedula.length === 0) return null;

    if (cleanCedula.length < 9 || cleanCedula.length > 12) {
      return "La cédula debe tener entre 9 y 12 dígitos";
    }

    if (!/^\d+$/.test(cleanCedula)) {
      return "La cédula solo debe contener números";
    }

    if (cleanCedula.length === 9) {
      const provinceCode = parseInt(cleanCedula.slice(0, 2), 10);
      if (provinceCode < 1 || provinceCode > 7) {
        return "Código de provincia inválido (debe ser entre 01-07)";
      }
    } else if (cleanCedula.length === 12) {
      const firstDigit = parseInt(cleanCedula[0], 10);
      if (firstDigit < 1 || firstDigit > 2) {
        return "Primer dígito inválido para cédula de 12 caracteres";
      }
    }

    return true;
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen">
      <ToastContainer />
      {/* Sección de formularios */}
      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 scrollbar-hide">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Link
              to="/login"
              className="flex items-center text-blue-velvet/80 mb-2 hover:text-blue-800 hover:scale-105 transition-transform duration-300"
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
              Iniciar Sesión
            </Link>

            <h1 className="text-3xl font-bold mb-2">Registro</h1>

            {/* Pestañas de selección de rol */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`flex-1 py-2 px-4 text-center font-medium flex items-center justify-center gap-2 ${
                  role === "owner"
                    ? "text-blue-velvet border-b-2 border-blue-velvet"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setRole("owner")}
              >
                <Briefcase size={18} />
                Propietario
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center font-medium flex items-center justify-center gap-2 ${
                  role === "employee"
                    ? "text-blue-velvet border-b-2 border-blue-velvet"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setRole("employee")}
              >
                <User size={18} />
                Empleado
              </button>
            </div>

            {/* Botón de registro con Google */}
            {role === "owner" && (
              <div className="flex justify-center mb-3">
                <Link
                  to="https://pos-centinela-backend.onrender.com/api/auth/google"
                  className="text-sm sm:text-base w-xs     flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full py-2.5 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                  >
                    <path
                      fill="#4285F4"
                      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                    />
                    <path
                      fill="#34A853"
                      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                    />
                    <path
                      fill="#EA4335"
                      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                    />
                    <path fill="none" d="M0 0h18v18H0z" />
                  </svg>
                  <span className="text-gray-700 font-medium mr-2">
                    Registrarse con Google
                  </span>
                </Link>
              </div>
            )}

            {/* Separador */}
            {role === "owner" && (
              <div className="flex items-center mb-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-10 text-gray-500">o</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            )}

            <p className="text-gray-600 mb-4">
              Ingresa tus datos para crear una cuenta
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Ingresa tu nombre"
                    {...register("nombres", {
                      required: "El nombre es requerido",
                    })}
                    className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Apellido *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Ingresa tu apellido"
                    {...register("apellidos", {
                      required: "El apellido es requerido",
                    })}
                    className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="cedula"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cédula/Identificación *
                </label>
                <input
                  id="cedula"
                  type="text"
                  placeholder="Ingresa tu número de identificación"
                  {...register("cedula", {
                    required: "La cédula es requerida",
                    pattern: {
                      value: /^[0-9- ]{6,12}$/,
                      message: "Formato de cédula inválido",
                    },
                    onChange: (e) => {
                      let value = e.target.value.replace(/[^0-9- ]/g, "");
                      if (value.length > 12) value = value.substring(0, 12);
                      e.target.value = value;
                    },
                  })}
                  className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    cedulaError || errors.cedula
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {(cedulaError || errors.cedula) && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">
                    {cedulaError || errors.cedula.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo electrónico *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo"
                  {...register("email", {
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico inválido",
                    },
                  })}
                  className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una contraseña"
                    {...register("password", {
                      required: "La contraseña es requerida",
                      minLength: {
                        value: 8,
                        message:
                          "La contraseña debe tener al menos 8 caracteres",
                      },
                    })}
                    className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {role === "employee" && (
                <div>
                  <label
                    htmlFor="businessCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Código del negocio *
                  </label>
                  <input
                    id="businessCode"
                    type="text"
                    placeholder="Ingrese el código proporcionado"
                    {...register("companyCode", {
                      required:
                        role === "employee"
                          ? "El código es requerido para empleados"
                          : false,
                    })}
                    className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.businessCode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.businessCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.businessCode.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked
                    {...register("terms", {
                      required: "Debes aceptar los términos y condiciones",
                    })}
                    className="h-4 w-4 text-blue-velvet focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-500">
                    Al crear una cuenta aceptas nuestros{" "}
                    <a
                      href="#"
                      className="text-blue-velvet hover:text-blue-500"
                    >
                      Términos y Condiciones
                    </a>
                    , y nuestra{" "}
                    <a
                      href="#"
                      className="text-blue-velvet hover:text-blue-500"
                    >
                      Política de Privacidad.
                    </a>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.terms.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-2xs bg-blue-velvet text-white py-2 px-4 rounded-full  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-2"
                >
                  Registrarse
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={goToLogin}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Iniciar Sesión
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de información */}
      <div className="hidden relative md:flex md:w-1/2 bg-obsidian items-center justify-center p-8">
        <div
          className="absolute inset-0 opacity-20 bg-obsidian bg-cover"
          style={{
            backgroundImage: "var(--wave-background)",
          }}
        ></div>
        <AuthLayout />
      </div>
    </div>
  );
};

export default RegisterPage;
