import { useEffect, useState } from "react";
import { Eye, Edit, Plus, UserPlus } from "lucide-react";
import useFetch from "../../../../hooks/useFetch.js";
import { toast } from "react-toastify";

const BusinessList = ({
  onSelectBusiness,
  onOpenRegisterForm,
  onInviteEmployee,
}) => {
  const { fetchDataBackend } = useFetch();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${import.meta.env.VITE_API_URL}/negocios/list`;
      const response = await fetchDataBackend(url, null, "GET");
      if (response && response.companyNames) {
        setBusinesses(response.companyNames);
      } else {
        setBusinesses([]);
        toast.info("No se encontraron negocios para este usuario.");
      }
    } catch (err) {
      console.error("Error fetching businesses:", err);
      if (err.message) {
        setBusinesses([]);
        toast.info("No se encontraron negocios para este usuario.");
      } else {
        setError("Error al cargar la lista de negocios.");
        toast.error("Error al cargar la lista de negocios.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  if (loading) {
    return <p>Cargando negocios...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Negocios</h2>
        <button
          onClick={onOpenRegisterForm}
          className="flex items-center px-4 py-2 bg-[var(--color-blue-velvet)] text-white rounded-lg hover:bg-[var(--color-blue-velvet)]/90"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Negocio
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {businesses.length === 0 ? (
          <p className="text-gray-500 text-center">
            Aún no has registrado ningún negocio. ¡Empieza ahora!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div
                key={business._id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={
                      business.logo ||
                      "https://res.cloudinary.com/dmccize09/image/upload/v1752099442/Administradores/gjypqxqip7qmud3at6wc.png"
                    }
                    alt="Logo del negocio"
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg">
                      {business.companyName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {business.companyCode}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onInviteEmployee(business)} // Nuevo botón de invitación
                    className="p-2 bg-green-100 rounded-full text-green-700 hover:bg-green-200"
                    title="Invitar Empleado"
                  >
                    <UserPlus size={18} />
                  </button>
                  <button
                    onClick={() => onSelectBusiness(business._id, "view")}
                    className="p-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300"
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onSelectBusiness(business._id, "edit")}
                    className="p-2 bg-blue-100 rounded-full text-blue-700 hover:bg-blue-200"
                    title="Editar negocio"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessList;
