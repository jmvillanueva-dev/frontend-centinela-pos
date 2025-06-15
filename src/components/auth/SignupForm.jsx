import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';


const SignupForm = ({ onToggleAuth }) => {
    const [role, setRole] = useState('owner');
    const {
    register,
    handleSubmit,
    formState: { errors },
} = useForm();

const { fetchDataBackend } = useFetch();

const onSubmit = (data) => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL;
        if (!baseUrl) {
            throw new Error('La URL de la API no está configurada');
        }

        const endpoint = role === 'owner' ? '/boss/register' : '/employees/register';
        const url = `${baseUrl}${endpoint}`;
        fetchDataBackend(url, data, 'POST');
    } catch (error) {
        console.log(error)
    }
};

// Función de validación para cédula costarricense (ejemplo)
const validateCedula = (cedula) => {
    const cleanCedula = cedula.replace(/[- ]/g, '');

    if (cleanCedula.length < 9 || cleanCedula.length > 12) return false;

    if (!/^\d+$/.test(cleanCedula)) return false;
    if (cleanCedula.length === 9) {
        const provinceCode = parseInt(cleanCedula.slice(0, 2), 10);
        if (provinceCode < 1 || provinceCode > 7) return false;
    } else if (cleanCedula.length === 12) {
        const firstDigit = parseInt(cleanCedula[0], 10);
        if (firstDigit < 1 || firstDigit > 2) return false;
    }  
    return true;
};

return (
<div className="w-full max-w-md">
    <Link to="/" className="flex items-center text-blue-velvet/80 mb-2 hover:text-blue-800 hover:scale-105 transition-transform duration-300">
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

    <h1 className="text-3xl font-bold mb-2">Registro</h1>
    <p className="text-gray-600 mb-4">
    Ingresa tus datos para crear una cuenta
    </p>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
        <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
        </label>
        <input
            id="firstName"
            type="text"
            placeholder="Ingresa tu nombre"
            {...register('nombres', { required: 'El nombre es requerido' })}
            className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
        )}
        </div>

        <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
        </label>
        <input
            id="lastName"
            type="text"
            placeholder="Ingresa tu apellido"
            {...register('apellidos', { required: 'El apellido es requerido' })}
            className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
        )}
        </div>
    </div>

    <div>
        <label htmlFor="identification" className="block text-sm font-medium text-gray-700 mb-1">
            Cédula/Identificación *
        </label>
        <input
            id="identification"
            type="text"
            placeholder="Ingresa tu número de identificación"
            {...register('identification', { 
            required: 'La cédula es requerida',
            pattern: {
                value: /^[0-9]{6,12}$/,
                message: 'La cédula debe contener solo números (6-12 dígitos)'
            },
            validate: {
                validId: value => validateCedula(value) || 'Cédula inválida'
            }
            })}
            className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.identification ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.identification && (
            <p className="mt-1 text-sm text-red-600 animate-fade-in">
            {errors.identification.message}
            </p>
        )}
    </div>

    <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Correo electrónico *
        </label>
        <input
        id="email"
        type="email"
        placeholder="Ingresa tu correo"
        {...register('email', {
            required: 'El correo es requerido',
            pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Correo electrónico inválido',
            },
        })}
        className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
        placeholder="Crea una contraseña"
        {...register('password', {
            required: 'La contraseña es requerida',
            minLength: {
            value: 8,
            message: 'La contraseña debe tener al menos 8 caracteres',
            },
        })}
        className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
        }`}
        />
        {errors.password && (
        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quién solicita el registro:</label>
        <div className="flex gap-4">
        <label className="inline-flex items-center">
            <input
            type="radio"
            value="owner"
            checked={role === 'owner'}
            onChange={() => setRole('owner')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">Propietario</span>
        </label>
        <label className="inline-flex items-center">
            <input
            type="radio"
            value="employee"
            checked={role === 'employee'}
            onChange={() => setRole('employee')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-gray-700">Empleado</span>
        </label>
        </div>
    </div>

    {role === 'employee' && (
        <div>
        <label htmlFor="businessCode" className="block text-sm font-medium text-gray-700 mb-1">
            Código del negocio *
        </label>
        <input
            id="businessCode"
            type="text"
            placeholder="Ingrese el código proporcionado"
            {...register('businessCode', {
            required: role === 'employee' ? 'El código es requerido para empleados' : false,
            })}
            className={`w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.businessCode ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.businessCode && (
            <p className="mt-1 text-sm text-red-600">{errors.businessCode.message}</p>
        )}
        </div>
    )}

    <div className="flex items-start">
        <div className="flex items-center h-5">
        <input
            id="terms"
            type="checkbox"
            {...register('terms', { required: 'Debes aceptar los términos y condiciones' })}
            className="h-4 w-4 text-blue-velvet focus:ring-blue-500 border-gray-300 rounded"
        />
        </div>
        <div className="ml-3 text-sm">
        <label htmlFor="terms" className="font-medium text-gray-700">
            Al crear una cuenta aceptas nuestros{' '}
            <a href="#" className="text-blue-velvet hover:text-blue-500">
            Términos y Condiciones
            </a>
            , y nuestra{' '}
            <a href="#" className="text-blue-velvet hover:text-blue-500">
            Política de Privacidad
            </a>
        </label>
        {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
        )}
        </div>
    </div>

    <button
        type="submit"
        className="w-full bg-blue-velvet text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
        Registrarse
    </button>
    </form>

    <div className="mt-6 text-center">
    <p className="text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <button
        onClick={onToggleAuth}
        className="text-blue-600 hover:text-blue-500 font-medium"
        >
        Iniciar Sesión
        </button>
    </p>
    </div>
</div>
);
};

export default SignupForm;