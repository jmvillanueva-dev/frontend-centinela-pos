import { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  Lock,
  Loader2,
  Upload,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";
import storeAuth from "../../../context/storeAuth.jsx";
import useFetch from "../../../hooks/useFetch.js";

// Componente del modal de perfil de usuario
const UserProfileModal = ({ isOpen, onClose }) => {
  // Estado global del usuario y función de login desde el store
  const { user: userData, login: loginToStore } = storeAuth();
  // Hook para peticiones al backend
  const { fetchDataBackend } = useFetch();

  // Estado para la pestaña activa ("profile" o "password")
  const [activeTab, setActiveTab] = useState("profile");
  // Estado para los datos del formulario del perfil
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
  });
  // Estado para los datos del formulario de la contraseña
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  // Estado para la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Estado de carga para mostrar retroalimentación al usuario durante las peticiones
  const [isLoading, setIsLoading] = useState(false);
  // Estado para el archivo de foto subido y su URL de previsualización
  const [uploadedPhotoFile, setUploadedPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  // Referencia al input de tipo 'file' para poder activarlo
  const fileInputRef = useRef(null);

  // Cargar los datos del usuario en el formulario al abrir el modal o si userData cambia
  useEffect(() => {
    if (userData) {
      setFormData({
        nombres: userData.nombres || "",
        apellidos: userData.apellidos || "",
        email: userData.email || "",
      });
      // Establecer la URL de la foto actual del usuario para la previsualización inicial
      if (userData.foto) {
        setPhotoPreviewUrl(userData.foto);
      }
    }
  }, [userData]);

  // Manejar la previsualización de la imagen cuando se selecciona un archivo
  useEffect(() => {
    if (uploadedPhotoFile) {
      const url = URL.createObjectURL(uploadedPhotoFile);
      setPhotoPreviewUrl(url);

      // Función de limpieza para liberar la memoria del objeto URL
      return () => URL.revokeObjectURL(url);
    }
    // Si no hay archivo nuevo, usar la foto existente si hay
    if (!uploadedPhotoFile && userData && userData.foto) {
      setPhotoPreviewUrl(userData.foto);
    }
  }, [uploadedPhotoFile, userData]);

  // Manejador para los cambios en los inputs del perfil
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador para los cambios en los inputs de la contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador para la selección de archivo de foto
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedPhotoFile(file);
    }
  };

  // Manejador para eliminar la foto de previsualización
  const handleRemovePhoto = () => {
    setUploadedPhotoFile(null);
    setPhotoPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Manejador para el envío del formulario de perfil
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = new FormData();
    dataToSend.append("nombres", formData.nombres);
    dataToSend.append("apellidos", formData.apellidos);
    dataToSend.append("email", formData.email);

    // Añadir la foto si se ha subido una nueva
    if (uploadedPhotoFile) {
      dataToSend.append("foto", uploadedPhotoFile);
    }

    try {
      // Petición PUT para actualizar el perfil
      const response = await fetchDataBackend(
        "https://pos-centinela-backend.onrender.com/api/employees/update",
        dataToSend,
        "PUT",
        true // Indicar a useFetch que use FormData
      );

      // CORRECCIÓN: Acceder al objeto de usuario anidado en 'data'
      const updatedUser = response?.data;

      // Actualizar el estado global y localStorage con los nuevos datos
      if (updatedUser) {
        loginToStore(localStorage.getItem("token"), updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Perfil actualizado correctamente. 🎉");
        onClose();
      } else {
        toast.error(response?.msg || "Error al actualizar el perfil.");
      }
    } catch (error) {
      toast.error(error.message || "Error al actualizar el perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejador para el envío del formulario de contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    try {
      // Petición PUT para actualizar la contraseña
      await fetchDataBackend(
        "https://pos-centinela-backend.onrender.com/api/employees/update/password",
        passwordData,
        "PUT"
      );

      toast.success("Contraseña actualizada correctamente.");
      // Limpiar los campos de la contraseña
      setPasswordData({ password: "", confirmPassword: "" });
      onClose();
    } catch (error) {
      toast.error(error.message || "Error al actualizar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Función para obtener las iniciales del usuario
  const getInitials = (nombres, apellidos) => {
    return `${nombres?.charAt(0) || ""}${
      apellidos?.charAt(0) || ""
    }`.toUpperCase();
  };

  // Determinar la fuente de la foto de perfil
  const userPhotoSrc =
    photoPreviewUrl ||
    `https://placehold.co/80x80/6366F1/FFFFFF?text=${getInitials(
      userData.nombres,
      userData.apellidos
    )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform scale-100 opacity-100 transition-all duration-300">
        <div className="p-8 md:p-10">
          {/* Header del modal */}
          <div className="flex justify-between items-center pb-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800">Mi Perfil</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-2 hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {/* Contenido principal: menú lateral y formularios */}
          <div className="mt-8 flex flex-col md:flex-row">
            {/* Menú lateral de navegación */}
            <div className="flex-none w-full md:w-64 mb-8 md:mb-0 md:pr-8 border-b md:border-b-0 md:border-r border-gray-200">
              {userData && (
                <div className="flex items-center space-x-4 mb-6">
                  {/* Foto de perfil con lógica de previsualización */}
                  <div className="relative">
                    <img
                      src={userPhotoSrc}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                    />
                    {/* Botón de carga de foto */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors"
                      aria-label="Cargar foto"
                    >
                      <Upload size={16} />
                    </button>
                    {/* Botón para eliminar la foto si se ha subido una nueva */}
                    {uploadedPhotoFile && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        aria-label="Eliminar foto"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                    {/* Input de archivo oculto */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">
                      {userData.nombres} {userData.apellidos}
                    </div>
                    <div className="text-sm text-gray-500">{userData.rol}</div>
                  </div>
                </div>
              )}
              <nav className="flex md:flex-col gap-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left p-4 rounded-lg flex items-center transition-colors duration-200 ${
                    activeTab === "profile"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <User size={20} className="mr-3" />
                  Datos Personales
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full text-left p-4 rounded-lg flex items-center transition-colors duration-200 ${
                    activeTab === "password"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Lock size={20} className="mr-3" />
                  Cambiar Contraseña
                </button>
              </nav>
            </div>

            {/* Contenedor del formulario dinámico */}
            <div className="flex-1 md:pl-8">
              {activeTab === "profile" && (
                <form onSubmit={handleProfileSubmit}>
                  <h4 className="text-xl font-semibold mb-6 text-gray-800">
                    Actualizar Datos Personales
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Nombres
                      </label>
                      <input
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleFormChange}
                        className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Apellidos
                      </label>
                      <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleFormChange}
                        className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading && (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      )}
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "password" && (
                <form onSubmit={handlePasswordSubmit}>
                  <h4 className="text-xl font-semibold mb-6 text-gray-800">
                    Actualizar Contraseña
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={passwordData.password}
                          onChange={handlePasswordChange}
                          className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 hover:text-gray-900"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Confirmar Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 hover:text-gray-900"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading && (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      )}
                      Cambiar Contraseña
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
