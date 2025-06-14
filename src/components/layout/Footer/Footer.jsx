import { 
  Phone, Mail, MapPin, Send,  Twitter, Instagram, Linkedin, Youtube, Facebook 
} from "lucide-react";
import centinelaLogo from '../../../assets/centinela.svg';

export default function Footer() {

    const socialLinks = [
        { icon: <Facebook className="w-5 h-5 text-blue-velvet" />, name: 'Facebook' },
        { icon: <Twitter className="w-5 h-5 text-blue-velvet" />, name: 'Twitter' },
        { icon: <Instagram className="w-5 h-5 text-blue-velvet" />, name: 'Instagram' },
        { icon: <Linkedin className="w-5 h-5 text-blue-velvet" />, name: 'LinkedIn' },
        { icon: <Youtube className="w-5 h-5 text-blue-velvet" />, name: 'YouTube' },
    ];

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Columna 1 - Logo y descripción */}
            <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center mb-6">
                    <span>
                    <img src={centinelaLogo} alt="" />
                    </span>
                </div>
                <p className="text-gray-600 text-center md:text-left mb-6 max-w-xs">
                La solución todo-en-uno para gestionar y hacer crecer tu negocio con inteligencia artificial.
                </p>
            <div className="flex space-x-3">
                {socialLinks.map((social) => (
                    <a 
                        key={social.name}
                        href="#"
                        className={`
                        w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center 
                        hover:bg-gray-100 transition-all shadow-sm hover:shadow-md
                        hover:border-blue-velvet hover:-translate-y-0.5
                        `}
                        aria-label={social.name}
                    >
                        {social.icon}
                    </a>
                ))}
            </div>

          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold text-obsidian mb-6 flex items-center">
              <span className="w-1 h-6 bg-teal-tide mr-2 rounded-full"></span>
              Navegación
            </h4>
            <ul className="space-y-3 text-center md:text-left">
              {['Inicio', 'Características', 'Planes', 'Clientes', 'Soporte'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-blue-velvet transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 - Contacto */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold text-obsidian mb-6 flex items-center">
              <span className="w-1 h-6 bg-blue-velvet mr-2 rounded-full"></span>
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center">
                <div className="p-2 border border-gray-light rounded-full mr-3">
                  <Mail className="text-blue-velvet" size={16} />
                </div>
                <span className="text-gray-600">soporte@centilenapos.com</span>
              </li>
              <li className="flex items-center">
                <div className="p-2 border  border-gray-light rounded-full mr-3">
                  <Phone className="text-blue-velvet" size={16} />
                </div>
                <span className="text-gray-600">+593 99 591 0854</span>
              </li>
              <li className="flex items-center">
                <div className="p-2 border border-gray-light rounded-full mr-3">
                  <MapPin className="text-blue-velvet" size={16} />
                </div>
                <span className="text-gray-600">Quito, Ecuador</span>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Newsletter */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold text-obsidian mb-6 flex items-center">
              <span className="w-1 h-6 bg-obsidian mr-2 rounded-full"></span>
              Newsletter
            </h4>
            <p className="text-gray-600 text-center md:text-left mb-4">
              Suscríbete para recibir actualizaciones y noticias.
            </p>
            <div className="w-full">
                <form action="">
                    <div className="flex flex-col gap-2 w-full">
                        <input 
                        type="email"
                            required
                        placeholder="Tu correo electrónico"
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-velvet focus:border-transparent flex-grow"
                        />
                        <button className="px-6 py-3 bg-teal-tide text-obsidian rounded-lg hover:bg-teal-tide/90  transition-colors flex items-center justify-center whitespace-nowrap hover:animate-wiggle">
                            Suscribirse
                            <Send className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Copyright */}
        <div className="pb-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} CentilenaPOS. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-blue-velvet text-sm transition-colors">
              Términos de servicio
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-velvet text-sm transition-colors">
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}