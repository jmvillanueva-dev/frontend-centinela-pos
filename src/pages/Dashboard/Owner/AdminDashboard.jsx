import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Home,
  Users,
  Settings,
  HelpCircle,
  Bell,
  ChevronDown,
  Plus,
  UserPlus,
  ShoppingCart,
  Package,
  BarChart2,
  Menu,
  X,
  Crown,
  Blocks,
  Edit3,
  LogOut,
} from "lucide-react";
import useFetch from "../../../hooks/useFetch.js";
import storeAuth from "../../../context/storeAuth.jsx";
import { ToastContainer, toast } from "react-toastify";
import AdminProfileModal from "./AdminProfileModal.jsx";
import centinelaIcon from "../../../assets/centinela-icon.svg";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { fetchDataBackend } = useFetch();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const {
    user: userData,
    logout: logoutFromStore,
    login: loginToStore,
  } = storeAuth();

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Efecto para manejar el responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Efecto para forzar la actualización de perfil si el usuario es de Google
  useEffect(() => {
    if (userData && userData.authGoogle) {
      setShowProfileModal(true);
    }
  }, [userData]);

  const handleLogout = () => {
    logoutFromStore();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Sesión cerrada correctamente");
  };

  const handleUpdateSuccess = (updatedUser) => {
    const token = localStorage.getItem("token");
    loginToStore(token, updatedUser);
  };

  // Formularios
  const {
    register: registerBusiness,
    handleSubmit: handleBusinessSubmit,
    formState: { errors: businessErrors },
    reset: resetBusiness,
  } = useForm();

  const {
    register: registerEmployee,
    handleSubmit: handleEmployeeSubmit,
    formState: { errors: employeeErrors },
    reset: resetEmployee,
  } = useForm();


  const registerNewBusiness = async (data) => {
    try {
      data.emailBoss = userData.email;
      const url = `${import.meta.env.VITE_API_URL}/negocio/create`;
      const response = await fetchDataBackend(url, data, "POST");

      if (!response || !response._id) {
        throw new Error("No se recibió una respuesta válida del servidor");
      }

      setShowBusinessModal(false);
      resetBusiness();
      // toast.success('Negocio registrado exitosamente');

      storeAuth.getState().login(storeAuth.getState().token, {
        ...userData,
        companyName: data.companyName,
      });
    } catch (error) {
      console.error("Error al registrar negocio:", error);
      let errorMessage = "Error al registrar el negocio";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.message) {
        errorMessage = error.message;
        console.log(errorMessage);
      }

      // toast.error(errorMessage);
    }
  };

  const registerNewEmployee = async (data) => {
    try {
      const payload = {
        emailEmpleado: data.email,
        emailJefe: userData.email,
      };

      const url = `${import.meta.env.VITE_API_URL}/negocio/add-employee`;
      const response = await fetchDataBackend(url, payload, "POST");

      if (!response || !response._id) {
        throw new Error("No se recibió una respuesta válida del servidor");
      }

      setShowEmployeeModal(false);
      resetEmployee();
      // toast.success('Empleado registrado exitosamente');
    } catch (error) {
      console.error("Error al registrar empleado:", error);
      let errorMessage = "Error al registrar el empleado";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.message) {
        errorMessage = error.message;
        console.log(errorMessage);
      }

      // toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--color-gray-light)]">
      <ToastContainer />

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 w-64 bg-[var(--color-obsidian)] text-white h-full transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-8 p-2">
            <div>
              <img
                src={centinelaIcon}
                alt="Centinela POS"
                className=" w-42 rounded-full"
              />
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
              {
                id: "dashboard",
                icon: <Home size={18} className="mr-3" />,
                label: "Dashboard",
              },
              {
                id: "analytics",
                icon: <BarChart2 size={18} className="mr-3" />,
                label: "Analíticas",
              },
              {
                id: "employees",
                icon: <Users size={18} className="mr-3" />,
                label: "Empleados",
              },
              {
                id: "inventory",
                icon: <Package size={18} className="mr-3" />,
                label: "Inventario",
              },
              {
                id: "settings",
                icon: <Settings size={18} className="mr-3" />,
                label: "Configuración",
              },
              {
                id: "help",
                icon: <HelpCircle size={18} className="mr-3" />,
                label: "Ayuda",
              },
            ].map((item) => (
              <div
                key={item.id}
                className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${
                  activeMenu === item.id
                    ? "bg-[var(--color-blue-velvet)]"
                    : "hover:bg-[var(--color-blue-velvet)]/50"
                }`}
                onClick={() => {
                  setActiveMenu(item.id);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          {/* Plan actual */}
          <div className="p-4 mt-auto bg-[var(--color-obsidian)]/80 rounded-lg">
            <div className="text-sm">Plan actual</div>
            <div className="flex my-2 text-[var(--color-teal-tide)]">
              <Blocks className="mr-2" />
              {userData.plan.toUpperCase()}
            </div>
            <button
              className="flex justify-center w-full bg-[var(--color-teal-tide)] text-[var(--color-obsidian)] p-2 rounded-lg font-light hover:opacity-90 transition"
              onClick={() => navigate("/dashboard/upgrade-plan")}
            >
              <Crown className="mr-2" />
              Mejorar Plan
            </button>
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
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-velvet)]"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </div>

            <div
              className="flex items-center cursor-pointer relative"
              ref={dropdownRef}
            >
              <div
                className="mr-2 hidden sm:block"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="font-medium">
                  {userData.nombres} {userData.apellidos}
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {userData.rol === "jefe" ? "Propietario | Admin" : "Empleado"}
                </div>
              </div>

              <div
                className="h-8 w-8 rounded-full bg-[var(--color-teal-tide)] flex items-center justify-center text-[var(--color-obsidian)] font-bold mr-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userData.foto ? (
                  <img
                    src={userData.foto}
                    alt=""
                    className="rounded-full aspect-square object-cover"
                  />
                ) : (
                  <>
                    {userData.nombres?.charAt(0)}
                    {userData.apellidos?.charAt(0)}
                  </>
                )}
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
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      setShowProfileModal(true);
                      setDropdownOpen(false);
                    }}
                  >
                    <Edit3 size={16} />
                    <span>Mi Perfil</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenido del dashboard */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <AdminProfileModal
            showModal={showProfileModal}
            setShowModal={setShowProfileModal}
            userData={userData}
            isAuthGoogleUser={userData?.authGoogle}
            onUpdateSuccess={handleUpdateSuccess}
          />
          {/* Sección de acciones rápidas */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Acciones rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center"
                onClick={() => setShowBusinessModal(true)}
              >
                <Plus
                  size={24}
                  className="mb-2 text-[var(--color-blue-velvet)]"
                />
                <span>Registrar negocio</span>
              </button>
              <button
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center"
                onClick={() => setShowEmployeeModal(true)}
              >
                <UserPlus
                  size={24}
                  className="mb-2 text-[var(--color-blue-velvet)]"
                />
                <span>Agregar empleado</span>
              </button>
              <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center">
                <ShoppingCart
                  size={24}
                  className="mb-2 text-[var(--color-blue-velvet)]"
                />
                <span>Punto de venta</span>
              </button>
              <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center">
                <Package
                  size={24}
                  className="mb-2 text-[var(--color-blue-velvet)]"
                />
                <span>Gestionar inventario</span>
              </button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-500 text-sm">Ventas hoy</div>
                  <div className="text-2xl font-bold">$1,248</div>
                </div>
                <div className="bg-[var(--color-teal-tide)]/10 p-2 rounded-lg">
                  <BarChart2
                    size={20}
                    className="text-[var(--color-teal-tide)]"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-500 text-sm">Empleados activos</div>
                  <div className="text-2xl font-bold">5</div>
                </div>
                <div className="bg-[var(--color-blue-velvet)]/10 p-2 rounded-lg">
                  <Users
                    size={20}
                    className="text-[var(--color-blue-velvet)]"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-500 text-sm">
                    Productos en stock
                  </div>
                  <div className="text-2xl font-bold">342</div>
                </div>
                <div className="bg-[var(--color-tangerine)]/10 p-2 rounded-lg">
                  <Package
                    size={20}
                    className="text-[var(--color-tangerine)]"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-500 text-sm">Clientes nuevos</div>
                  <div className="text-2xl font-bold">12</div>
                </div>
                <div className="bg-[var(--color-teal-tide)]/10 p-2 rounded-lg">
                  <UserPlus
                    size={20}
                    className="text-[var(--color-teal-tide)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Otras secciones del dashboard... */}
        </main>
      </div>

      {showBusinessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Encabezado del modal */}
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                Registrar Nuevo Negocio
              </h3>
              <button
                onClick={() => setShowBusinessModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Cuerpo del formulario */}
            <form
              onSubmit={handleBusinessSubmit(registerNewBusiness)}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna Izquierda */}
                <div className="space-y-4">
                  {/* Nombre del negocio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del negocio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...registerBusiness("companyName", {
                        required: "Este campo es obligatorio",
                        minLength: {
                          value: 3,
                          message: "Mínimo 3 caracteres",
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Delicias Andinas"
                    />
                    {businessErrors.companyName && (
                      <p className="mt-1 text-sm text-red-600">
                        {businessErrors.companyName.message}
                      </p>
                    )}
                  </div>

                  {/* RUC */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RUC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...registerBusiness("ruc", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value: /^[0-9]{13}$/,
                          message: "RUC debe tener 13 dígitos",
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 17999887766"
                    />
                    {businessErrors.ruc && (
                      <p className="mt-1 text-sm text-red-600">
                        {businessErrors.ruc.message}
                      </p>
                    )}
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...registerBusiness("categoria", {
                        required: "Seleccione una categoría",
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccione una categoría...</option>
                      <option value="Alimentos">Alimentos</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Ropa">Ropa</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Otros">Otros</option>
                    </select>
                    {businessErrors.categoria && (
                      <p className="mt-1 text-sm text-red-600">
                        {businessErrors.categoria.message}
                      </p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      {...registerBusiness("telefono", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Teléfono debe tener 10 dígitos",
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 0987654321"
                    />
                    {businessErrors.telefono && (
                      <p className="mt-1 text-sm text-red-600">
                        {businessErrors.telefono.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="space-y-4">
                  {/* Dirección */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...registerBusiness("direccion", {
                        required: "Este campo es obligatorio",
                        minLength: {
                          value: 5,
                          message: "Mínimo 5 caracteres",
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Calle Venezuela 123"
                    />
                    {businessErrors.direccion && (
                      <p className="mt-1 text-sm text-red-600">
                        {businessErrors.direccion.message}
                      </p>
                    )}
                  </div>

                  {/* Email del negocio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email del negocio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...registerBusiness("emailNegocio", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido",
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: info@negocio.com"
                    />
                    {businessErrors.emailNegocio && (
                      <p className="mt-1 text-sm text-red-600">
                        {businessErrors.emailNegocio.message}
                      </p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      {...registerBusiness("descripcion", {
                        maxLength: {
                          value: 200,
                          message: "Máximo 200 caracteres",
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      placeholder="Breve descripción del negocio (opcional)"
                    />
                    {businessErrors.descripcion && (
                      <p className="mt-1 text-sm text-red-600">
                        {businessErrors.descripcion.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pie del modal - Botones */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBusinessModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Registrar Negocio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Registrar Nuevo Empleado
              </h3>
              <button
                onClick={() => {
                  setShowEmployeeModal(false);
                  resetEmployee();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleEmployeeSubmit(registerNewEmployee)}
              className="p-4 md:p-6"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email del empleado <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...registerEmployee("email", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ejemplo@email.com"
                />
                {employeeErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {employeeErrors.email.message}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmployeeModal(false);
                    resetEmployee();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Registrar Empleado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
