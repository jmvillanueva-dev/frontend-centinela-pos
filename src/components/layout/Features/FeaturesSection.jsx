import { Monitor, MonitorPlay, Users, Zap, BarChart2, ShoppingCart, Shield, ArrowRight, Laptop } from "lucide-react";

export default function CompactFeaturesSection() {
  const features = [
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "POS Inteligente",
      description: "Sistema integrado con análisis en tiempo real.",
      color: "text-blue-velvet"
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Monitoreo",
      description: "Visualiza operaciones desde cualquier dispositivo.",
      color: "text-teal-tide"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestión de Equipos",
      description: "Optimiza personal con herramientas de IA.",
      color: "text-tangerine"
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Análisis Predictivos",
      description: "Anticipa tendencias de venta.",
      color: "text-blue-velvet"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Recomendaciones IA",
      description: "Sugerencias automáticas personalizadas.",
      color: "text-teal-tide"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Seguridad Garantizada",
      description: "Encriptación bancaria y respaldos.",
      color: "text-tangerine"
    }
  ];

  return (
    <section className="py-16 bg-obsidian text-white">
      <div className=" container mx-auto px-4">
        {/* Encabezado compacto */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-tide to-blue-velvet bg-clip-text text-transparent">
              Potencia tu negocio
            </span>
          </h2>
          <p className="text-lg text-gray-light">
            Soluciones inteligentes para transformar tu comercio
          </p>
        </div>

        {/* Grid compacto de características */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-obsidian-light rounded-lg p-6 border border-slate-700 hover:border-teal-tide/30 transition-all duration-200 hover:shadow-md"
            >
              <div className={`${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-light text-sm mb-4">{feature.description}</p>
              <a 
                href="#" 
                className="inline-flex items-center text-sm font-medium text-teal-tide hover:text-white transition-colors"
              >
                Más información
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>

        {/* CTA compacto */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="#"
              className="group px-6 py-3 bg-blue-velvet text-white font-medium rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center">
                <Laptop className="w-5 h-5 mr-2 group-hover:animate-pulse group-hover:scale-125 transition-all duration-300" />
                Solicitar Demo
              </span>
            </a>
            <a
              href="#"
              className="px-6 py-3 border border-teal-tide text-teal-tide font-medium rounded-full hover:bg-teal-tide/10 transition-transform hover:scale-105 duration-300"
            >
             <span className="flex items-center justify-center">
                <MonitorPlay className="w-5 h-5 mr-2" />
                Video Demo
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}