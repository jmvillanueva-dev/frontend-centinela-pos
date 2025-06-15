import { MapPin, Mail, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    alert('¡Gracias por contactarnos! Nos pondremos en contacto pronto.');
  };

  return (
    <section id="contact" className=" bg-white">

      <div className="container mx-auto lg:flex lg:gap-8 py-16 lg:px-20 md:px-10 px-5">
        {/* Columna de información de contacto */}
      <div className="lg:w-1/2 lg:pb-0 pb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-obsidian">
          Contacta a <span className="text-blue-velvet">Nuestro Equipo</span>
        </h2>
        <p className='pb-6 lg:pr-20 text-gray-600'>
          Estamos comprometidos a brindarte el mejor soporte. Nuestro equipo está listo para ayudarte con cualquier consulta sobre nuestro sistema POS inteligente.
        </p>
        
        <div className="space-y-5">
          <div>
            <h4 className="text-lg font-semibold text-obsidian">Oficina Matriz:</h4>
            <address className="flex items-start gap-3 pt-2 text-gray-600">
              <MapPin className="text-blue-velvet mt-0.5 flex-shrink-0" />
              <span>Calle 10 #42-28, Quito, Ecuador</span>
            </address>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-obsidian">Correo Electrónico</h4>
            <a 
              href="mailto:soporte@centilenapos.com" 
              className="flex items-center gap-3 pt-2 text-gray-600 hover:text-blue-velvet transition-colors"
            >
              <Mail className="text-blue-velvet" />
              <span>soporte@centilenapos.com</span>
            </a>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-obsidian">Teléfono</h4>
            <a 
              href="tel:+593 99 591 0854" 
              className="flex items-center gap-3 pt-2 text-gray-600 hover:text-blue-velvet transition-colors"
            >
              <Phone className="text-blue-velvet" />
              <span>+593 99 591 0854</span>
            </a>
          </div>
        </div>
      </div>

      {/* Columna del formulario */}
      <div className='lg:w-1/2 flex flex-col text-obsidian py-8 rounded-xl lg:px-10 md:px-8 px-6 bg-gray-50 border border-gray-200 shadow-sm'>
        <h2 className="text-xl font-medium text-blue-velvet mb-6">
          ¿Tienes preguntas? Contácta a nuestro equipo de soporte
        </h2>
        
        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Nombre <span className='text-red-500'>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-velvet focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
              Teléfono <span className='text-red-500'>*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Tu número de teléfono"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-velvet focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Correo Electrónico <span className='text-red-500'>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-velvet focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="¿Cómo podemos ayudarte?"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-velvet focus:border-transparent"
            ></textarea>
          </div>
          
          <div className='flex justify-center pt-2'>
            <button
              type="submit"
              className="group flex items-center gap-2 py-3 px-8 rounded-lg bg-blue-velvet hover:bg-blue-700 text-white font-medium hover:scale-105 transition-transform shadow-md duration-300"
            >
              <Send className="w-5 h-5 group-hover:scale-125 transition-transform duration-300 group-hover:animate-pulse" />
              Enviar Mensaje
            </button>
          </div>
        </form>
      </div>
      </div>
      
    </section>
  );
}