import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const LoginForm = ({ onToggleAuth }) => {
const {
register,
handleSubmit,
formState: { errors },
} = useForm();

const onSubmit = (data) => {
console.log(data);
toast.success('Inicio de sesión exitoso');
// Aquí iría la lógica de autenticación
};

return (
<div className="w-full max-w-md">
    <Link to="/" className="flex items-center text-blue-velvet/80  mb-6 hover:text-blue-800 hover:scale-105 transition-transform duration-300">
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

    

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Correo electrónico *
        </label>
        <input
        id="email"
        type="email"
        placeholder="info@gmail.com"
        {...register('email', { required: 'El correo es requerido' })}
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
        <input
        id="password"
        type="password"
        placeholder="Ingresa tu contraseña"
        {...register('password', { required: 'La contraseña es requerida' })}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
        }`}
        />
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
        className="w-full bg-blue-velvet text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
        Iniciar Sesión
    </button>
    </form>

    {/* <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-600">O</span>
        <div className="flex-grow border-t border-gray-300"></div>
    </div> */}

    {/* <div className="grid grid-cols-1 gap-3 sm:gap-5 w-fit mx-auto">
        <button className="flex items-center justify-center w-full py-2 px-4 text-sm border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800">
            <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className='mr-2'
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
            Ingresar con Google
        </button>
    </div> */}

    <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <button
            onClick={onToggleAuth}
            className="text-blue-velvet hover:text-blue-500 font-medium"
            >
            Regístrate
            </button>
        </p>
    </div>
</div>
);
};

export default LoginForm;