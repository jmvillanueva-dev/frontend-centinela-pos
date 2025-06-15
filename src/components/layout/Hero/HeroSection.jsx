import { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Cpu, 
  Brain, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Star, 
  MonitorPlay, 
  ArrowRight, 
  BrainCircuit,
  ChartLine,
  Store,
  SwitchCamera
} from "lucide-react";

import centinelaLogo from "../../../assets/centinela.svg";
import posDemo from "../../../assets/pos-demo.mp4";
import posDemoV1 from "../../../assets/pos-demo-v1.mp4";
import posDemoV2 from "../../../assets/pos-demo-v2.mp4";

export default function HeroSection() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showPOS, setShowPOS] = useState(true);

  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = useRef([]);
  const videos = [posDemoV2,posDemoV1,posDemo,];

  // Configuración inicial de los videos
  useEffect(() => {
    videoRefs.current.forEach(video => {
      video.currentTime = 0;
      if (video !== videoRefs.current[activeVideo]) {
        video.pause();
      } else {
        video.play().catch(e => console.log("Autoplay prevented:", e));
      }
    });
  }, [activeVideo]);

  // Manejo más robusto del evento ended
  const handleVideoEnd = (index) => {
    // Verifica que el video que terminó sea el actualmente activo
    if (index === activeVideo) {
      setActiveVideo((prev) => (prev + 1) % videos.length);
    }
  };

  const features = [
    "Evalúa el rendimiento de tu personal con IA",
    "Recomienda productos automáticamente",
    "Analiza patrones de venta en tiempo real",
    "Optimiza la productividad del equipo",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const scrollToFeatures = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  const toggleVisualization = () => {
    setShowPOS(!showPOS);
  };

  return (
    <section id="home">
      <div className="relative min-h-screen bg-white overflow-hidden">

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20 bg-[#151932] bg-cover" 
        style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%231e2552' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3E%3Cpath fill='%23243075' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3E%3Cpath fill='%2328399a' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3E%3Cpath fill='%232a40c1' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3E%3Cpath fill='%233850DC' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/%3E%3Cpath fill='%233877dd' d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/%3E%3Cpath fill='%23399edd' d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/%3E%3Cpath fill='%2339c5de' d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/%3E%3Cpath fill='%233aded0' d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/%3E%3Cpath fill='%233ADFAA' d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative max-w-screen-xl z-1 mx-auto px-4 py-15 lg:py-5 xl:px-0">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen">
          
          {/* Left side - Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            
            {/* Badge */}
            <div className="inline-flex items-center w-fit px-4 py-2 mb-1 text-obsidian text-sm font-medium bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <BrainCircuit className="w-4 h-4 mr-2" />
              Potenciado por Inteligencia Artificial
            </div>

            {/* Main headline */}
            <div className="flex justify-center lg:justify-start mt-4 mb-4">
              <img src={centinelaLogo} alt="" className="w-110" />
            </div>
            <span className="block text-3xl lg:text-[40px] font-normal text-[#151932] ">
              Punto de venta inteligente
            </span>

            {/* Dynamic subtitle */}
            <div className="h-16">
              <p className="text-xl lg:text-2xl bg-gradient-to-r from-blue-velvet to-cyan-500 bg-clip-text text-transparent transition-all duration-500 ease-in-out">
                {features[currentFeature]}
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
              <div className="flex items-center bg-gray-light backdrop-blur-sm rounded-full px-4 py-2 text-obsidian hover:animate-wiggle">
                <Brain className="w-5 h-5 mr-2 text-obsidian" />
                <span className="text-sm font-medium">IA Avanzada</span>
              </div>
              <div className="flex items-center bg-gray-light backdrop-blur-sm rounded-full px-4 py-2 text-obsidian hover:animate-wiggle">
                <TrendingUp className="w-5 h-5 mr-2 text-obsidian" />
                <span className="text-sm font-medium">+40% Ventas</span>
              </div>
              <div className="flex items-center bg-gray-light backdrop-blur-sm rounded-full px-4 py-2 text-obsidian hover:animate-wiggle">
                <Users className="w-5 h-5 mr-2 text-obsidian" />
                <span className="text-sm font-medium">Gestión de Personal</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <a className="group relative px-8 py-4 bg-blue-velvet text-white font-semibold rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl cursor-pointer">
                <span className="flex items-center justify-center">
                  Pruébalo ahora
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:animate-pulse group-hover:translate-x-2 group-hover:scale-150 transition-all duration-300" />
                </span>
              </a>
              
              <div className="flex rounded-full bg-gradient-to-tr from-blue-velvet to-teal-tide p-0.5 shadow-lg will-change-transform">
                <button className="group flex-1 text-md bg-gray-light px-6 py-3 hover:scale-105 rounded-full hover:-translate-y-2 transition duration-500 items-center flex justify-center hover:shadow-md will-change">
                  <span className="flex items-center justify-center">
                    <MonitorPlay className="w-5 h-5 group-hover:scale-125 mr-2 transition-all duration-300" />
                    Ver Demo  
                  </span>
                </button>
              </div>
            </div>

            {/* Social proof */}
            {/* <div className="flex items-center justify-center lg:justify-start space-x-6 text-obsidian/80">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-obsidian to-blue-velvet rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm">Las empresas ecuatorianas confían en nosotros</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-tangerine mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm">4.9/5</span>
              </div>
            </div> */}
          </div>

          {/* Right side - Visual */}
          <div className="lg:w-1/2 relative">
            <div className="relative">
              {/* Botón para alternar entre visualizaciones */}
              <button 
                onClick={toggleVisualization}
                className="absolute -top-8 right-0 z-10 flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-obsidian hover:bg-white transition-all shadow-lg hover:shadow-xl"
              >
                <SwitchCamera className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">
                  {showPOS ? "" : ""}
                </span>
              </button>

{showPOS ? (
  // Visualización del Punto de Venta
  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-white/20 shadow-xl/30 transform rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-obsidian font-bold text-lg flex items-center">
        <Store className="w-6 h-6 mr-2 text-blue-velvet" />
        Gestiona tus ventas con nuestro sistema POS
      </h3>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </div>
    </div>
    
    {/* Imagen del POS */}
    {/* <div className="relative rounded-xl overflow-hidden border border-gray-200/50 shadow-lg">
      <img 
        src={posImage} 
        alt="Punto de Venta Centinela" 
        className="w-full h-   object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="text-white font-medium">Interfaz intuitiva y fácil de usar</div>
        <div className="text-white/80 text-sm">Escaneo de productos, gestión de inventario y más</div>
      </div>
    </div> */}
    <div className="relative rounded-xl overflow-hidden border border-gray-200/50 shadow-lg h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-1"></div>
      
      {videos.map((videoSrc, index) => (
        <video
          key={index}
          ref={el => videoRefs.current[index] = el}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-700 ease-in-out ${
            activeVideo === index ? 'opacity-100 z-2' : 'opacity-0 z-2'
          }`}
          onEnded={() => handleVideoEnd(index)}
          onPlaying={() => console.log(`Video ${index} started`)} // Para debug
          src={videoSrc}
          preload="auto"
        />
      ))}
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-2">
        <div className="text-white font-medium">Interfaz intuitiva y fácil de usar</div>
        <div className="text-white/80 text-sm">Escaneo de productos, gestión de inventario y más</div>
      </div>
    </div>
    
    {/* Elementos flotantes */}
    <div className="absolute top-18 right-4 bg-gradient-to-r from-blue-velvet to-cyan-500 rounded-full p-4 shadow-lg animate-fade-left animate-ease-in-out z-3">
      <ShoppingCart className="w-6 h-6 text-white" />
    </div>
  </div>
) : (
  // Visualización del Dashboard (original)
  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-white/20 shadow-xl/30 transform rotate-3 hover:rotate-0 transition-transform duration-500">
    <div className="bg-gradient-to-r bg-obsidian rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">Panel de Control IA</h3>
        <div className="w-3 h-3 bg-teal-tide rounded-full animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-white/80 text-sm">Ventas Hoy</div>
          <div className="text-white font-bold text-xl">$12,450</div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-white/80 text-sm">Eficiencia</div>
          <div className="text-white font-bold text-xl">94%</div>
        </div>
      </div>
    </div>

    {/* AI Recommendations */}
    <div className="space-y-3">
      <div className="flex items-center bg-blue-velvet/90 rounded-lg p-3">
        <Brain className="w-6 h-6 text-white mr-3" />
        <div>
          <div className="text-white text-sm font-medium">Recomendación para tu cliente</div>
          <div className="text-gray-300 text-xs">Ofrecer producto complementario</div>
        </div>
      </div>
      <div className="flex items-center bg-teal-tide/90 rounded-lg p-3">
        <ChartLine className="w-6 h-6 text-obsidian mr-3" />
        <div>
          <div className="text-obsidian text-sm font-medium">Análisis de Rendimiento</div>
          <div className="text-obsidian text-xs">Empleado del mes: María</div>
        </div>
      </div>
    </div>
    
    {/* Floating elements */}
    <div className="absolute -top-0 -right-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-4 shadow-lg animate-fade-left animate-ease-in-out">
      <ShoppingCart className="w-6 h-6 text-white" />
    </div>
    
    <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-4 shadow-lg animate-fade-right">
      <Cpu className="w-6 h-6 text-white" />
    </div>
  </div>
)}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute sm:bottom-0 xl:bottom-12 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={scrollToFeatures}
            className="flex flex-col items-center text-blue-velvet hover:text-obsidian hover:animate-bounce hover:cursor-pointer transition-colors duration-300 group"
          >
            <span className="text-sm mb-2">Descubre más</span>
            <ChevronDown className="w-6 h-6 animate-bounce group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
      </div>
    </section>
    
  );
}