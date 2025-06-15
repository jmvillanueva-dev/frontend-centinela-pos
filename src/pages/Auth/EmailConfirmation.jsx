import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckCircle } from 'lucide-react';


const EmailConfirmation = () => {
  const { token, rol } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      const toastId = toast.loading("Verificando tu email...");
      
      try {
        // Determinar la URL basada en el rol
        const endpoint = rol === 'jefe' 
          ? `/boss/confirm/${token}`
          : `/employees/confirm/${token}`;
        
        const url = `${import.meta.env.VITE_API_URL}${endpoint}`;
        
        // Usamos fetch directamente para evitar toast duplicado
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || 'Error al verificar el email');
        }

        // Cerrar toast de carga y mostrar éxito
        toast.dismiss(toastId);
        toast.success(
          rol === 'jefe' 
            ? 'Tu cuenta de propietario ha sido verificada correctamente' 
            : 'Tu cuenta de empleado ha sido verificada correctamente',
          { autoClose: 5000 }
        );

        setVerificationStatus('success');

      } catch (error) {
        toast.dismiss(toastId);
        
        // Manejar específicamente el caso de cuenta ya verificada
        if (error.message.includes('ya ha sido verificada')) {
          toast.info(error.message, { autoClose: 5000 });
          setVerificationStatus('success');
        } else {
          toast.error(error.message || 'Error al verificar el email');
          setVerificationStatus('error');
          setTimeout(() => navigate('/login'), 3000);
        }
      }
    };

    verifyEmail();
  }, [token, rol, navigate]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const Button = ({ children, onClick, className = '' }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium text-white bg-blue-velvet rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${className}`}
    >
      {children}
    </button>
  );

  if (verificationStatus === 'verifying') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-4">Verificando tu email...</h2>
          <p className="text-gray-600">Estamos confirmando tu {rol === 'jefe' ? 'cuenta de propietario' : 'cuenta de empleado'}</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-4 text-red-500">Error en la verificación</h2>
          <p className="text-gray-600 mb-6">Redirigiendo al inicio de sesión...</p>
          <Button onClick={handleLoginRedirect} className="mt-4">
            Volver ahora
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* Fondo SVG */}
      <div 
        className="fixed inset-0 opacity-20 bg-cover -z-10" 
        style={{
          backgroundImage: `url("data:image/svg+xml,...")` // Tu SVG aquí
        }}
      />
      
      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-obsidian/90 rounded-lg shadow-md animate-fade-in">
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle className="w-16 h-16 text-teal-tide animate-bounce" />
          <h1 className="text-2xl font-bold text-center text-white">
            ¡Email Verificado!
          </h1>
          <p className="text-center text-gray-light">
            Tu email de {rol === 'jefe' ? 'propietario' : 'empleado'} ha sido verificado exitosamente.
          </p>
          <p className="text-center text-gray-light">
            Ahora puedes iniciar sesión y disfrutar de todos nuestros servicios.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Button 
            onClick={handleLoginRedirect}
            className="w-full py-3 text-base hover:scale-105 transition-transform"
          >
            Ir a Iniciar Sesión
          </Button>

          <p className="text-sm text-center text-gray-light">
            ¿Necesitas ayuda?{' '}
            <a 
              href="/support" 
              className="text-teal-tide hover:text-blue-700 hover:underline"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;