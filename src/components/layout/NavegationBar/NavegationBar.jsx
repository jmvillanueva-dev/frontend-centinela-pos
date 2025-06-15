import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { 
  Menu, X, ShoppingCart, Zap, User, ChevronDown,
  CircleUserRound, Home, DollarSign, MessageSquare
} from "lucide-react";

import iconLogo from "../../../assets/icon-logo.svg";

const NavigationBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Inicio", href: "#home", icon: <Home size={16} /> },
    { 
      name: "Productos", 
      href: "#",
      submenu: [
        { name: "POS Inteligente", icon: <ShoppingCart size={16} /> },
        { name: "Análisis IA", icon: <Zap size={16} /> },
        { name: "Gestión de Personal", icon: <User size={16} /> }
      ]
    },
    { name: "Precios", href: "#pricing", icon: <DollarSign size={16} /> },
    { name: "Contacto", href: "#contact", icon: <MessageSquare size={16} /> }
  ];

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center">
              <img src={iconLogo} alt="Logo" className=" w-25 mr-2" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                <a
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-full transition-colors cursor-pointer text-obsidian ${isScrolled ? "hover:bg-gray-light" : "hover:bg-obsidian hover:text-white"}`}
                  onClick={() => item.submenu && toggleSubmenu(index)}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span className="font-medium">
                    {item.name}
                  </span>
                  {item.submenu && (
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeSubmenu === index ? "rotate-180" : ""} text-obsidian`} />
                  )}
                </a>

                {item.submenu && activeSubmenu === index && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="py-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href="#"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <span className="mr-2">{subItem.icon}</span>
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/auth/login" 
              className={`px-6 py-2.5 font-medium rounded-full transition-all ${isScrolled ? "bg-blue-velvet text-white hover:bg-blue-velvet/90" : "bg-white text-obsidian hover:bg-gray-100"} shadow-md hover:scale-105`}
            >
              <span className="flex items-center">
                <CircleUserRound size={16} className="mr-2" />
                Iniciar Sesión
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-full ${isScrolled ? "text-obsidian" : "text-white"}`}
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-xl mt-3 p-4 shadow-xl border border-gray-200">
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <div key={index}>
                  <div
                    className="flex justify-between items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => item.submenu && toggleSubmenu(index)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.submenu && (
                      <ChevronDown className={`h-5 w-5 transition-transform ${activeSubmenu === index ? "rotate-180" : ""}`} />
                    )}
                  </div>

                  {item.submenu && activeSubmenu === index && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href="#"
                          className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="mr-2">{subItem.icon}</span>
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/auth/login"
                  className="flex items-center justify-center px-6 py-2.5 bg-blue-velvet text-white font-medium rounded-full hover:bg-blue-velvet/90 transition-colors shadow-md"
                >
                  <CircleUserRound size={16} className="mr-2" />
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationBar;