import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import storeAuth from '../../context/storeAuth.jsx';
import useFetch from '../../hooks/useFetch.js';
import { User, Briefcase, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { fetchDataBackend } = useFetch();
  const [activeTab, setActiveTab] = useState('employee');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    const endpoint = activeTab === 'boss' ? '/boss/login' : '/employees/login';
    
    const response = await fetchDataBackend(
      `${import.meta.env.VITE_API_URL}${endpoint}`,
      {
        email: data.email,
        password: data.password
      },
      'POST'
    );

    // Validar la estructura básica de la respuesta
    if (!response || !response.nombres || !response.rol || !response._id) {
      throw new Error('La respuesta del servidor no tiene la estructura esperada');
    }

    // Verificar que el rol coincida con la pestaña seleccionada
    const expectedRole = activeTab === 'boss' ? 'jefe' : 'empleado';
    if (response.rol !== expectedRole) {
      throw new Error(`Debes iniciar sesión como ${expectedRole === 'jefe' ? 'Propietario' : 'Empleado'}`);
    }

    // Guardar datos en el store sin token (usamos un valor temporal)
    storeAuth.getState().login('token-temporario', {
      nombres: response.nombres,
      apellidos: response.apellidos,
      cedula: response.cedula,
      email: response.email,
      companyCode: response.companyCode,
      plan: response.plan,
      rol: response.rol,
      _id: response._id
    });

    // Redirigir según el rol
    const redirectPath = response.rol === 'jefe' 
      ? '/dashboard/admin' 
      : '/dashboard/employee';
    
    navigate(redirectPath);
    toast.success(`Bienvenido ${response.nombres} ${response.apellidos}`);

  } catch (error) {
    console.error('Error en el login:', error);
    
    let errorMessage = 'Error al iniciar sesión';
    
    if (error.response) {
      errorMessage = error.response.data?.msg || 
                    error.response.data?.message || 
                    `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // toast.error(errorMessage);

    if (error.response?.status === 401) {
      reset({ password: '' });
    }
  } finally {
    setIsLoading(false);
  }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goToRegister = () => {
    navigate('/register');
  };
  return (
    <div className="flex h-screen">
       <ToastContainer />
      {/* Sección de formularios */}
      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 scrollbar-hide">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Link to="/" className="flex items-center text-blue-velvet/80 mb-6 hover:text-blue-800 hover:scale-105 transition-transform duration-300">
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
              Volver al inicio
            </Link>

            <h1 className="text-3xl font-bold mb-2">Iniciar Sesión</h1>
            <p className="text-gray-600 mb-8">
              Ingresa tu correo y contraseña para acceder
            </p>

            {/* Pestañas de selección de rol */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`flex-1 py-2 px-4 text-center font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'employee'
                    ? 'text-blue-velvet border-b-2 border-blue-velvet'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('employee')}
              >
                <User size={18} />
                Empleado
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'boss'
                    ? 'text-blue-velvet border-b-2 border-blue-velvet'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('boss')}
              >
                <Briefcase size={18} />
                Propietario
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="info@gmail.com"
                  {...register('email', { 
                    required: 'El correo es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Correo electrónico inválido'
                    }
                  })}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    {...register('password', { 
                      required: 'La contraseña es requerida',
                      minLength: {
                        value: 8,
                        message: 'La contraseña debe tener al menos 8 caracteres'
                      }
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    {...register('rememberMe')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Mantener sesión iniciada
                  </label>
                </div>

                <Link to="/forgot-password" className="text-sm text-blue-velvet hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-velvet text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <button
                  onClick={goToRegister}
                  className="text-blue-velvet hover:text-blue-500 font-medium"
                >
                  Regístrate
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
          style={{ backgroundImage: 'var(--wave-background)' }}>
        </div>
        <AuthLayout />
      </div>
    </div>
  );
};

export default LoginPage;