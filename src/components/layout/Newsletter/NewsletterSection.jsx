import { ChevronDown, Send } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
const [email, setEmail] = useState('');
const [isSubscribed, setIsSubscribed] = useState(false);

const handleSubmit = (e) => {
e.preventDefault();
// Aquí iría la lógica para enviar el email a tu servicio de newsletter
console.log('Email suscrito:', email);
setIsSubscribed(true);
setEmail('');
setTimeout(() => setIsSubscribed(false), 5000);
};

return (
<div className="relative bg-gradient-to-r from-blue-velvet to-purple-900">
    {/* Onda decorativa inferior */}
    <div className="absolute inset-x-0 bottom-0">
    <svg 
        viewBox="0 0 224 12" 
        fill="currentColor" 
        className="w-full -mb-1 text-white" 
        preserveAspectRatio="none"
    >
        <path
        d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z"
        />
    </svg>
    </div>

    {/* Contenido */}
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
    <div className="relative max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl sm:text-center">
        <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-tight text-center text-white sm:text-4xl sm:leading-none">
        Únete a nuestra <span className="text-teal-tide">comunidad</span>
        </h2>
        
        <p className="mb-6 text-base text-blue-100 md:text-lg">
        Recibe las últimas actualizaciones, consejos para tu negocio y ofertas exclusivas directamente en tu correo.
        </p>
        
        {isSubscribed ? (
        <div className="p-4 mb-8 text-white bg-green-500/20 rounded-lg border border-green-400">
            ¡Gracias por suscribirte! Pronto recibirás nuestras novedades.
        </div>
        ) : (
        <form 
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full mb-4 md:flex-row md:px-16"
        >
            <input
            placeholder="Tu correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow w-full h-12 px-4 mb-3 text-obsidian transition duration-200 rounded-full appearance-none md:mr-2 md:mb-0 bg-white focus:border-teal-tide focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-blue-velvet/50"
            />
            <button
            type="submit"
            className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-obsidian  transition duration-200 rounded-full shadow-md md:w-auto bg-teal-tide hover:bg-teal-tide/90 hover:animate-wiggle focus:outline-none focus:ring-2 focus:ring-white/50"
            >
            Suscribirse
            <Send className="ml-2 w-5 h-5" />
            </button>
        </form>
        )}
        
        <p className="max-w-md mx-auto mb-10 text-sm tracking-wide text-blue-100/80 md:mb-16">
        Respetamos tu privacidad. Nunca compartiremos tu información.
        </p>
    </div>
    </div>
</div>
);
}