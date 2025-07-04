import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Package, Clock, Bell, ChevronDown, BarChart2, Users, Menu, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import storeAuth from '../../../context/storeAuth.jsx';

import centinelaIcon from '../../../assets/centinela-icon.svg';

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const dropdownRef = useRef(null);
    const { user: userData, logout: logoutFromStore } = storeAuth();

    // Efecto para manejar el responsive
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logoutFromStore();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        toast.success('Sesión cerrada correctamente');
    };

    return (
        <div className="flex h-screen bg-[var(--color-gray-light)]">
            <ToastContainer/>

            {/* Sidebar Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative z-30 w-64 bg-[var(--color-obsidian)] text-white h-full transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex flex-col h-full p-4">
                    <div className="flex justify-between items-center mb-8 p-2">
                        <div>
                            <img src={centinelaIcon} alt="Centinela POS" className=" w-42 rounded-full" />
                            <p className="text-sm opacity-80">Sistema de ventas con IA</p>
                        </div>
                        <button 
                            className="md:hidden text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1">
                        {[
                            { id: 'dashboard', icon: <Home size={18} className="mr-3" />, label: 'Dashboard' },
                            { id: 'pos', icon: <ShoppingCart size={18} className="mr-3" />, label: 'Punto de Venta' },
                            { id: 'inventory', icon: <Package size={18} className="mr-3" />, label: 'Inventario' },
                            { id: 'schedule', icon: <Clock size={18} className="mr-3" />, label: 'Mi horario' }
                        ].map((item) => (
                            <div 
                                key={item.id}
                                className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activeMenu === item.id ? 'bg-[var(--color-blue-velvet)]' : 'hover:bg-[var(--color-blue-velvet)]/50'}`}
                                onClick={() => {
                                    setActiveMenu(item.id);
                                    if (isMobile) setSidebarOpen(false);
                                }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </nav>

                    {/* Información del empleado */}
                    <div className="p-4 mt-auto bg-[var(--color-obsidian)]/80 rounded-lg">
                        {/* <div className="text-sm mb-1">Estás en</div>
                        <div className="font-bold">{userData.companyName}</div> */}
                    </div>
                </div>
            </aside>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center">
                        <button 
                            className="mr-4 text-gray-600 md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="relative w-full md:w-64">
                            <input 
                                type="text" 
                                placeholder="Buscar producto..." 
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-velvet)]"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative cursor-pointer">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">1</span>
                        </div>
                        
                        <div className="flex items-center cursor-pointer relative" ref={dropdownRef}>
                            <div 
                                className="h-8 w-8 rounded-full bg-[var(--color-teal-tide)] flex items-center justify-center text-[var(--color-obsidian)] font-bold mr-2"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                {userData.nombres?.charAt(0)}{userData.apellidos?.charAt(0)}
                            </div>
                            <div className="mr-1 hidden sm:block">
                                <div className="font-medium">{userData.nombres} {userData.apellidos}</div>
                                <div className="text-xs text-gray-500">Empleado</div>
                            </div>
                            <ChevronDown 
                                size={16} 
                                className="text-gray-500 hidden sm:block" 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            />
                            
                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <div className="block px-4 py-2 text-sm font-medium sm:hidden">
                                        {userData.nombres} {userData.apellidos}
                                    </div>
                                    <button 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        onClick={handleLogout}
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Contenido del dashboard */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    {/* Bienvenida */}
                    <div className="mb-8 bg-white p-4 md:p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-2">Bienvenido, {userData.nombres}</h2>
                        <p className="text-gray-600">Estás trabajando en {userData.companyName}</p>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Acciones rápidas</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button 
                                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center"
                                onClick={() => setActiveMenu('pos')}
                            >
                                <ShoppingCart size={24} className="mb-2 text-[var(--color-blue-velvet)]" />
                                <span>Abrir POS</span>
                            </button>
                            <button 
                                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center"
                                onClick={() => setActiveMenu('inventory')}
                            >
                                <Package size={24} className="mb-2 text-[var(--color-blue-velvet)]" />
                                <span>Ver inventario</span>
                            </button>
                            <button 
                                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center"
                                onClick={() => toast.info('Próximamente: Reporte de ventas')}
                            >
                                <BarChart2 size={24} className="mb-2 text-[var(--color-blue-velvet)]" />
                                <span>Mis ventas</span>
                            </button>
                        </div>
                    </div>

                    {/* Estadísticas personales */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-gray-500 text-sm">Ventas hoy</div>
                                    <div className="text-xl md:text-2xl font-bold">$842</div>
                                </div>
                                <div className="bg-[var(--color-teal-tide)]/10 p-2 rounded-lg">
                                    <ShoppingCart size={20} className="text-[var(--color-teal-tide)]" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-gray-500 text-sm">Productos vendidos</div>
                                    <div className="text-xl md:text-2xl font-bold">24</div>
                                </div>
                                <div className="bg-[var(--color-blue-velvet)]/10 p-2 rounded-lg">
                                    <Package size={20} className="text-[var(--color-blue-velvet)]" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-gray-500 text-sm">Clientes atendidos</div>
                                    <div className="text-xl md:text-2xl font-bold">18</div>
                                </div>
                                <div className="bg-[var(--color-tangerine)]/10 p-2 rounded-lg">
                                    <Users size={20} className="text-[var(--color-tangerine)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EmployeeDashboard;