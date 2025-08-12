import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useFetch from "../../../hooks/useFetch.js";
import storeAuth from "../../../context/storeAuth.jsx";
import {
  FaUserPlus,
  FaUsers,
  FaUserCircle,
  FaBuilding,
  FaSignOutAlt,
  FaEye,
  FaTrashAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import centinelaLogo from "../../../assets/centinela.svg";

// Obtiene la URL de la API del entorno
const API_URL = import.meta.env.VITE_API_URL;

// Componente para el registro de nuevos administradores
const RegisterAdmin = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { fetchDataBackend } = useFetch();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetchDataBackend(
        `${API_URL}/admins/register`,
        data,
        "POST"
      );
      toast.success(
        response.msg ||
          "Administrador registrado con éxito. Se ha enviado un correo de confirmación."
      );
      reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Registrar Nuevo Administrador
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombres
          </label>
          <input
            type="text"
            {...register("nombres", { required: "Los nombres son requeridos" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.nombres && (
            <p className="mt-1 text-sm text-red-600">
              {errors.nombres.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Apellidos
          </label>
          <input
            type="text"
            {...register("apellidos", {
              required: "Los apellidos son requeridos",
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.apellidos && (
            <p className="mt-1 text-sm text-red-600">
              {errors.apellidos.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cédula
          </label>
          <input
            type="text"
            {...register("cedula", { required: "La cédula es requerida" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.cedula && (
            <p className="mt-1 text-sm text-red-600">{errors.cedula.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "El email es requerido" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
        >
          {loading ? "Registrando..." : "Registrar Administrador"}
        </button>
      </form>
    </div>
  );
};

// Componente para actualizar el perfil del administrador
const AdminProfile = () => {
  const { fetchDataBackend } = useFetch();
  const { user, token } = storeAuth.getState();

  // Instancia de useForm para el formulario de actualización de perfil
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: errorsProfile },
  } = useForm({
    defaultValues: {
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
    },
  });

  // Instancia de useForm para el formulario de cambio de contraseña
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword },
  } = useForm();

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [file, setFile] = useState(null);

  const onSubmitProfile = async (data) => {
    setLoadingProfile(true);
    try {
      const formData = new FormData();
      formData.append("nombres", data.nombres);
      formData.append("apellidos", data.apellidos);
      formData.append("email", data.email);
      if (file) {
        formData.append("foto", file);
      }

      const response = await fetchDataBackend(
        `${API_URL}/admins/perfil/update`,
        formData,
        "PUT"
      );

      // La respuesta del backend contiene los datos en 'response.data'
      storeAuth.setState({ user: { ...user, ...response.data }, token });
      localStorage.setItem("user", JSON.stringify(response.data));

      toast.success(response.msg || "Perfil actualizado con éxito.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setLoadingPassword(true);
    try {
      const response = await fetchDataBackend(
        `${API_URL}/admins/perfil/update/password`,
        data,
        "PUT"
      );
      toast.success(response.msg || "Contraseña actualizada con éxito.");
      resetPassword({ password: "", confirmPassword: "", adminCode: "" });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario para actualizar perfil */}
        <div className="p-4 border border-gray-200 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Actualizar Datos</h3>
          <form
            onSubmit={handleSubmitProfile(onSubmitProfile)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombres
              </label>
              <input
                type="text"
                {...registerProfile("nombres", {
                  required: "Los nombres son requeridos",
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errorsProfile.nombres && (
                <p className="mt-1 text-sm text-red-600">
                  {errorsProfile.nombres.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Apellidos
              </label>
              <input
                type="text"
                {...registerProfile("apellidos", {
                  required: "Los apellidos son requeridos",
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errorsProfile.apellidos && (
                <p className="mt-1 text-sm text-red-600">
                  {errorsProfile.apellidos.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...registerProfile("email", {
                  required: "El email es requerido",
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errorsProfile.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errorsProfile.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Foto
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <button
              type="submit"
              disabled={loadingProfile}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
            >
              {loadingProfile ? "Actualizando..." : "Actualizar Perfil"}
            </button>
          </form>
        </div>

        {/* Formulario para cambiar contraseña */}
        <div className="p-4 border border-gray-200 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Cambiar Contraseña</h3>
          <form
            onSubmit={handleSubmitPassword(onSubmitPassword)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <input
                type="password"
                {...registerPassword("password", {
                  required: "La nueva contraseña es requerida",
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errorsPassword.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errorsPassword.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                {...registerPassword("confirmPassword", {
                  required: "Confirma la contraseña",
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errorsPassword.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errorsPassword.confirmPassword.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código de Administrador
              </label>
              <input
                type="password"
                {...registerPassword("adminCode", {
                  required: "El código de administrador es requerido",
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errorsPassword.adminCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errorsPassword.adminCode.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
            >
              {loadingPassword ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente para ver el detalle de un administrador
const AdminDetail = ({ admin, onBack, onDeactivate }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full overflow-y-auto">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        &larr; Volver
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Detalle de Administrador
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={
            admin.foto ||
            "https://placehold.co/128x128/9CA3AF/FFFFFF?text=Sin+Foto"
          }
          alt={`${admin.nombres} ${admin.apellidos}`}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-900">
            {admin.nombres} {admin.apellidos}
          </p>
          <p className="text-gray-600">Email: {admin.email}</p>
          <p className="text-gray-600">Cédula: {admin.cedula}</p>
          <p className="text-gray-600">Rol: {admin.rol}</p>
          <p className="text-gray-600">Código Admin: {admin.adminCode}</p>
          <p className="text-gray-600">
            Estado:{" "}
            <span
              className={`font-bold ${
                admin.status ? "text-green-600" : "text-red-600"
              }`}
            >
              {admin.status ? "Activo" : "Inactivo"}
            </span>
          </p>
        </div>
      </div>
      {admin.status && admin._id !== "686dbc4a3db0c30454d5fd93" && (
        <button
          onClick={() => onDeactivate(admin._id)}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <FaTrashAlt /> Desactivar Administrador
        </button>
      )}
    </div>
  );
};

// Componente para el listado de administradores
const AdminList = ({ onSelectAdmin }) => {
  const { fetchDataBackend } = useFetch();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDataBackend(
        `${API_URL}/admins/list?status=activo`,
        null,
        "GET"
      );
      // La API devuelve un array directamente
      if (response && Array.isArray(response)) {
        setAdmins(response);
      } else {
        setAdmins([]);
        toast.error("Formato de respuesta inesperado");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500">
        Cargando administradores...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (admins.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No hay administradores para mostrar.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Lista de Administradores
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre Completo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={
                      admin.foto ||
                      "https://placehold.co/40x40/9CA3AF/FFFFFF?text=NF"
                    }
                    alt={admin.nombres}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {admin.nombres} {admin.apellidos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {admin.status ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onSelectAdmin(admin._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaEye className="inline-block" /> Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente para ver el detalle de un jefe
const BossDetail = ({ boss, onBack }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full overflow-y-auto">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        &larr; Volver
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Detalle de Propietario
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={
            boss.foto ||
            "https://placehold.co/128x128/9CA3AF/FFFFFF?text=Sin+Foto"
          }
          alt={`${boss.nombres} ${boss.apellidos}`}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-900">
            {boss.nombres} {boss.apellidos}
          </p>
          <p className="text-gray-600">Email: {boss.email}</p>
          <p className="text-gray-600">Cédula: {boss.cedula}</p>
          <p className="text-gray-600">Rol: {boss.rol}</p>
          <p className="text-gray-600">
            Plan: <span className="font-semibold">{boss.plan}</span>
          </p>
          <p className="text-gray-600">
            Estado:{" "}
            <span
              className={`font-bold ${
                boss.status ? "text-green-600" : "text-red-600"
              }`}
            >
              {boss.status ? "Activo" : "Inactivo"}
            </span>
          </p>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
        Negocios Registrados
      </h3>
      {boss.companyNames && boss.companyNames.length > 0 ? (
        <ul className="space-y-4">
          {boss.companyNames.map((company) => (
            <li
              key={company._id}
              className="bg-gray-50 p-4 rounded-md border border-gray-200"
            >
              <p className="font-semibold text-lg">{company.companyName}</p>
              <p className="text-gray-600">RUC: {company.ruc}</p>
              <p className="text-gray-600">
                Email del Negocio: {company.emailNegocio}
              </p>
              <p className="text-gray-600">
                Descripción: {company.descripcion}
              </p>
              <p className="text-gray-600">
                Estado:{" "}
                <span
                  className={`font-bold ${
                    company.status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {company.status ? "Activo" : "Inactivo"}
                </span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">
          No hay negocios registrados para este propietario.
        </p>
      )}
    </div>
  );
};

// Componente para el listado de jefes de negocio
const BossList = ({ onSelectBoss }) => {
  const { fetchDataBackend } = useFetch();
  const [bosses, setBosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBosses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDataBackend(
        `${API_URL}/admins/list/boss`,
        null,
        "GET"
      );
      // La API devuelve un array directamente
      if (response && Array.isArray(response)) {
        setBosses(response);
      } else {
        setBosses([]);
        toast.error("Formato de respuesta inesperado");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBosses();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500">Cargando propietarios...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (bosses.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No hay propietarios para mostrar.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Lista de Propietarios de Negocios
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre Completo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bosses.map((boss) => (
              <tr key={boss._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={
                      boss.foto ||
                      "https://placehold.co/40x40/9CA3AF/FFFFFF?text=NF"
                    }
                    alt={boss.nombres}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {boss.nombres} {boss.apellidos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {boss.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {boss.plan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onSelectBoss(boss._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaEye className="inline-block" /> Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente principal del Dashboard del Administrador
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("perfil"); // "perfil", "register-admin", "list-admins", "list-bosses"
  const [selectedUser, setSelectedUser] = useState(null);
  const { fetchDataBackend } = useFetch();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleDeactivateAdmin = async (adminId) => {
    // Usar un modal personalizado en lugar de `window.confirm`
    // const confirmed = await showCustomConfirmModal("¿Estás seguro de que quieres desactivar a este administrador?");
    // if (confirmed) { ... }
    if (
      window.confirm(
        "¿Estás seguro de que quieres desactivar a este administrador?"
      )
    ) {
      try {
        const response = await fetchDataBackend(
          `${API_URL}/admins/delete/${adminId}`,
          null,
          "PUT"
        );
        toast.success(response.msg || "Administrador desactivado con éxito.");
        setSelectedUser(null);
        setView("list-admins");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleLogout = () => {
    storeAuth.setState({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const renderContent = () => {
    if (selectedUser) {
      if (view === "list-admins") {
        return (
          <AdminDetail
            admin={selectedUser}
            onBack={() => setSelectedUser(null)}
            onDeactivate={handleDeactivateAdmin}
          />
        );
      } else if (view === "list-bosses") {
        return (
          <BossDetail
            boss={selectedUser}
            onBack={() => setSelectedUser(null)}
          />
        );
      }
    }

    switch (view) {
      case "perfil":
        return <AdminProfile />;
      case "register-admin":
        return <RegisterAdmin />;
      case "list-admins":
        return (
          <AdminList
            onSelectAdmin={async (id) => {
              try {
                const response = await fetchDataBackend(
                  `${API_URL}/admins/detail/${id}`,
                  null,
                  "GET"
                );
                // La API devuelve el objeto directamente
                setSelectedUser(response);
              } catch (error) {
                toast.error(error.message);
              }
            }}
          />
        );
      case "list-bosses":
        return (
          <BossList
            onSelectBoss={async (id) => {
              try {
                const response = await fetchDataBackend(
                  `${API_URL}/admins/detail/boss/${id}`,
                  null,
                  "GET"
                );
                // La API devuelve el objeto directamente
                setSelectedUser(response);
              } catch (error) {
                toast.error(error.message);
              }
            }}
          />
        );
      default:
        return <AdminProfile />;
    }
  };

  const { user: userData } = storeAuth();

  // Función para obtener las iniciales del usuario
  const getUserInitials = (nombres, apellidos) => {
    const firstInitial = nombres ? nombres.charAt(0) : "";
    const lastInitial = apellidos ? apellidos.charAt(0) : "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Cargando datos del usuario...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar de Navegación */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <img
            src={centinelaLogo}
            alt="Centinela POS"
            className=" w-42 rounded-full"
          />
          <h1 className="text-xl font-bold text-indigo-600">
            Panel de Control
          </h1>
        </div>
        <div className="p-6 border-b border-gray-200 flex flex-col items-center">
          {/* Lógica para mostrar la foto o las iniciales */}
          {userData.foto ? (
            <img
              src={userData.foto}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold">
              {getUserInitials(userData.nombres, userData.apellidos)}
            </div>
          )}
          <div className="mt-4 text-center">
            <p className="text-base font-bold text-indigo-600">
              {userData.rol.toUpperCase()}
            </p>
            <p className="text-gray-800">
              {userData.nombres} {userData.apellidos}
            </p>
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => {
                  setView("perfil");
                  setSelectedUser(null);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-md transition-colors ${
                  view === "perfil"
                    ? "bg-indigo-100 text-indigo-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaUserCircle /> Mi Perfil
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => {
                  setView("register-admin");
                  setSelectedUser(null);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-md transition-colors ${
                  view === "register-admin"
                    ? "bg-indigo-100 text-indigo-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaUserPlus /> Registrar Admin
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => {
                  setView("list-admins");
                  setSelectedUser(null);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-md transition-colors ${
                  view === "list-admins"
                    ? "bg-indigo-100 text-indigo-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaUsers /> Ver Administradores
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => {
                  setView("list-bosses");
                  setSelectedUser(null);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-md transition-colors ${
                  view === "list-bosses"
                    ? "bg-indigo-100 text-indigo-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaBuilding /> Listar Propietarios
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
