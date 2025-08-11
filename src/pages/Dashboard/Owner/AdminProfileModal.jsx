import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useFetch from "../../../hooks/useFetch.js";
import {
  X,
  User,
  Lock,
  Upload,
  Eye,
  EyeOff,
  XCircle,
} from "lucide-react";

const AdminProfileModal = ({
  showModal,
  setShowModal,
  userData,
  isAuthGoogleUser,
  onUpdateSuccess,
}) => {
  const { fetchDataBackend } = useFetch();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  // Formulario de perfil
  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
    watch: watchProfile,
    setValue: setProfileValue,
  } = useForm({
    defaultValues: {
      nombres: userData?.nombres,
      apellidos: userData?.apellidos,
      cedula: userData?.cedula,
      email: userData?.email,
      foto: null,
    },
  });

  // Formulario de contraseña
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm();

  const watchedFoto = watchProfile("foto");

  // Este useEffect se encargará de resetear el formulario cada vez que
  // el modal se abra o el prop `userData` cambie, asegurando que
  // los campos del formulario muestren los datos más recientes.
  useEffect(() => {
    if (showModal && userData) {
      resetProfile({
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        cedula: userData.cedula,
        email: userData.email,
        foto: null,
      });
      resetPassword();
    }
  }, [showModal, userData, resetProfile, resetPassword]);

  // Vista previa de imagen
  useEffect(() => {
    if (watchedFoto && watchedFoto.length > 0) {
      const file = watchedFoto[0];
      const url = URL.createObjectURL(file);
      setUploadedPhotoUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setUploadedPhotoUrl(null);
    }
  }, [watchedFoto]);

  const closeModal = () => {
    if (isAuthGoogleUser) {
      toast.warn("Debes actualizar tu perfil para continuar.");
      return;
    }
    setShowModal(false);
    resetProfile();
    resetPassword();
    setUploadedPhotoUrl(null);
  };

  const onProfileSubmit = async (data) => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("nombres", data.nombres);
    formData.append("apellidos", data.apellidos);
    if (data.cedula !== userData.cedula) {
      formData.append("cedula", data.cedula);
    }
    formData.append("email", data.email);

    if (data.foto && data.foto.length > 0) {
      formData.append("foto", data.foto[0]);
    }

    try {
      const url = `${import.meta.env.VITE_API_URL}/boss/perfil/update`;
      const response = await fetchDataBackend(url, formData, "PUT");

      if (
        (response && response.msg === "Datos actualizados correctamente") ||
        response.msg ===
          "Datos actualizados correctamente, excepto el email (no se puede modificar un email de Google)"
      ) {
        toast.success("Perfil actualizado con éxito!");
        const updatedUser = { ...userData, ...response.data };
        onUpdateSuccess(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        closeModal();
      } else {
        toast.error(response?.msg || "Error al actualizar el perfil.");
      }
    } catch (error) {
      toast.error(error.message || "Error al actualizar el perfil.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setIsUpdating(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/boss/perfil/update/password`;
      const response = await fetchDataBackend(
        url,
        { password: data.password, confirmPassword: data.confirmPassword },
        "PUT"
      );

      if (response && response.msg === "Password actualizado correctamente") {
        toast.success("Contraseña actualizada con éxito!");
        closeModal();
      } else {
        toast.error(response?.msg || "Error al actualizar la contraseña.");
      }
    } catch (error) {
      toast.error("Error de conexión al actualizar la contraseña.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetPhoto = () => {
    setProfileValue("foto", null);
    setUploadedPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!showModal) return null;

  const photoSrc =
    uploadedPhotoUrl ||
    userData?.foto ||
    `https://placehold.co/100x100/A0AEC0/FFFFFF?text=${userData?.nombres?.charAt(
      0
    )}${userData?.apellidos?.charAt(0)}`;

  return (
    <div className="fixed inset-0 bg-gray-800/80 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center font-sans">
      <div className="relative p-6 bg-white mx-auto rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col ">
          <div className="flex justify-between items-center mb-4">
            <h3 className=" text-2xl font-bold text-gray-900">
              {isAuthGoogleUser
                ? "Actualización de Datos Requerida"
                : "Gestiona tu Perfil"}
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            {isAuthGoogleUser
              ? "IMPORTANTE: Actualiza tus datos para continuar"
              : "Actualiza tu información personal o cambia tu contraseña"}
          </p>
        </div>

        {!isAuthGoogleUser && (
          <div className="flex mt-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors border-b-2 ${
                activeTab === "profile"
                  ? "border-[var(--color-blue-velvet)] text-[var(--color-blue-velvet)] font-medium"
                  : "border-transparent text-gray-700 hover:text-gray-900"
              }`}
            >
              <User size={18} />
              <span>Perfil</span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors border-b-2 ${
                activeTab === "password"
                  ? "border-[var(--color-blue-velvet)] text-[var(--color-blue-velvet)] font-medium"
                  : "border-transparent text-gray-700 hover:text-gray-900"
              }`}
            >
              <Lock size={18} />
              <span>Contraseña</span>
            </button>
          </div>
        )}

        {activeTab === "profile" && (
          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <img
                  src={photoSrc}
                  alt="Foto de perfil"
                  className="h-24 w-24 rounded-full object-cover border-2 border-gray-300"
                />
                <div
                  className="absolute bottom-0 right-0 p-2 bg-[var(--color-blue-velvet)] rounded-full text-white cursor-pointer hover:bg-blue-600 transition-colors"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload size={16} />
                </div>
                {uploadedPhotoUrl && (
                  <div
                    className="absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-600 transition-colors"
                    onClick={handleResetPhoto}
                  >
                    <XCircle size={16} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  {...profileRegister("foto")}
                  ref={(e) => {
                    fileInputRef.current = e;
                    profileRegister("foto").ref(e);
                  }}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500">
                Haz clic en el ícono para cambiar la foto
              </p>
            </div>

            {/* Campos del formulario */}
            <div>
              <label className="block text-xs sm:text-sm text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...profileRegister("email", {
                  required: "Email es obligatorio",
                })}
                className="mt-1 p-1 px-3 w-full text-sm sm:text-base italic rounded-md block text-gray-400 border-gray-300 shadow-sm focus:border-[var(--color-blue-velvet)] focus:ring-[var(--color-blue-velvet)]"
                disabled
              />
              {profileErrors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {profileErrors.email.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-700">
                  Nombres
                </label>
                <input
                  type="text"
                  {...profileRegister("nombres", {
                    required: "Nombres son obligatorios",
                  })}
                  className="mt-1 p-1 px-3 w-full text-sm sm:text-base rounded-md block border-gray-300 shadow-sm focus:border-[var(--color-blue-velvet)] focus:ring-[var(--color-blue-velvet)]"
                />
                {profileErrors.nombres && (
                  <p className="mt-1 text-sm text-red-500">
                    {profileErrors.nombres.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-700">
                  Apellidos
                </label>
                <input
                  type="text"
                  {...profileRegister("apellidos", {
                    required: "Apellidos son obligatorios",
                  })}
                  className="mt-1 p-1 px-3 w-full text-sm sm:text-base rounded-md block border-gray-300 shadow-sm focus:border-[var(--color-blue-velvet)] focus:ring-[var(--color-blue-velvet)]"
                />
                {profileErrors.apellidos && (
                  <p className="mt-1 text-sm text-red-500">
                    {profileErrors.apellidos.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm text-gray-700">
                Cédula
              </label>
              <input
                type="text"
                {...profileRegister("cedula", {
                  required: "Cédula es obligatoria",
                })}
                className="mt-1 p-1 px-3 w-full text-sm sm:text-base rounded-md block border-gray-300 shadow-sm focus:border-[var(--color-blue-velvet)] focus:ring-[var(--color-blue-velvet)]"
              />
              {profileErrors.cedula && (
                <p className="mt-1 text-sm text-red-500">
                  {profileErrors.cedula.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--color-blue-velvet)] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-blue-velvet)]"
                disabled={isUpdating}
              >
                {isUpdating ? "Actualizando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        )}

        {activeTab === "password" && (
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-4 mt-4"
          >
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Cambia tu contraseña actual, utiliza una contraseña segura y
                única.
              </p>
              <label className="block text-xs sm:text-sm text-gray-700">
                Ingresa tu Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...passwordRegister("password", {
                    required: "Contraseña es obligatoria",
                  })}
                  className="mt-1 p-1 px-3 w-full text-sm sm:text-base rounded-md block border-gray-300 shadow-sm focus:border-[var(--color-blue-velvet)] focus:ring-[var(--color-blue-velvet)] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {passwordErrors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-700">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...passwordRegister("confirmPassword", {
                    required: "Confirmar contraseña es obligatorio",
                  })}
                  className="mt-1 p-1 px-3 w-full text-sm sm:text-base rounded-md block border-gray-300 shadow-sm focus:border-[var(--color-blue-velvet)] focus:ring-[var(--color-blue-velvet)] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--color-blue-velvet)] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-blue-velvet)]"
                disabled={isUpdating}
              >
                {isUpdating ? "Actualizando..." : "Cambiar Contraseña"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProfileModal;