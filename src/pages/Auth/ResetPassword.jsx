import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useFetch from '../../hooks/useFetch.js';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const { fetchDataBackend } = useFetch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors } = useForm();
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const bossUrl = `${import.meta.env.VITE_API_URL}/boss/password/verify/${token}`;
                await fetchDataBackend(bossUrl, null, 'GET');
                setIsTokenValid(true);
                setUserRole('boss');
            } catch (bossError) {
                try {
                    const employeeUrl = `${import.meta.env.VITE_API_URL}/employees/password/verify/${token}`;
                    await fetchDataBackend(employeeUrl, null, 'GET');
                    setIsTokenValid(true);
                    setUserRole('employee');
                } catch (employeeError) {
                    setIsTokenValid(false);
                }
            }
        };
        verifyToken();
    }, [token]);

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Las contraseñas no coinciden'
            });
            return;
        }
        
        clearErrors('confirmPassword');

        const endpoint = userRole === 'boss' 
            ? `/boss/password/reset/${token}` 
            : `/employees/password/reset/${token}`;
        
        const url = `${import.meta.env.VITE_API_URL}${endpoint}`;
        
        try {
            await fetchDataBackend(url, { 
                password: data.password,
                confirmpassword: data.confirmPassword
            }, 'POST');
            navigate('/login');
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
        }
    };

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    useEffect(() => {
        if (password && confirmPassword && password !== confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Las contraseñas no coinciden'
            });
        } else if (errors.confirmPassword?.type === 'manual') {
            clearErrors('confirmPassword');
        }
    }, [password, confirmPassword, setError, clearErrors]);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[var(--color-white)] p-4">
            <div 
                className="absolute inset-0 opacity-20 bg-obsidian bg-cover" 
                style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%231e2552' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3E%3Cpath fill='%23243075' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3E%3Cpath fill='%2328399a' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3E%3Cpath fill='%232a40c1' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3E%3Cpath fill='%233850DC' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/%3E%3Cpath fill='%233877dd' d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/%3E%3Cpath fill='%23399edd' d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/%3E%3Cpath fill='%2339c5de' d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/%3E%3Cpath fill='%233aded0' d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/%3E%3Cpath fill='%233ADFAA' d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="w-full max-w-sm bg-white/60 rounded-xl shadow-lg overflow-hidden z-2">
                <div className="bg-gradient-to-r from-blue-velvet to-purple-900 p-6 text-center">
                    <h1 className="text-2xl font-bold text-white">
                        Restablecer contraseña
                    </h1>
                </div>

                <div className="p-6">
                    {isTokenValid ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[var(--color-obsidian)] mb-1">
                                    Nueva contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="block w-full rounded-md border border-[var(--color-gray-light)] focus:border-[var(--color-blue-velvet)] focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-velvet)] py-2 px-3 text-[var(--color-obsidian)] pr-10"
                                        {...register("password", {
                                            required: "La contraseña es requerida",
                                            minLength: {
                                                value: 8,
                                                message: "Mínimo 8 caracteres"
                                            }
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-[var(--color-obsidian)]" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-[var(--color-obsidian)]" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-[var(--color-obsidian)] mb-1">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="block w-full rounded-md border border-[var(--color-gray-light)] focus:border-[var(--color-blue-velvet)] focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-velvet)] py-2 px-3 text-[var(--color-obsidian)] pr-10"
                                        {...register("confirmPassword", {
                                            required: "Confirma tu contraseña"
                                        })}
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-[var(--color-obsidian)]" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-[var(--color-obsidian)]" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-velvet text-white font-medium py-2.5 px-4 rounded-full hover:bg-blue-700 transition duration-200 shadow-md disabled:opacity-50"
                                disabled={!!errors.password || !!errors.confirmPassword || !password || !confirmPassword}
                            >
                                Actualizar contraseña
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-obsidian mb-4">Enlace inválido o expirado</p>
                            <Link
                                to="/forgot-password"
                                className="inline-flex items-center text-white border border-blue-velvet px-4 py-2 rounded-full bg-blue-velvet hover:bg-blue-700 font-normal text-sm mt-2"
                            >
                                Solicitar nuevo enlace
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;