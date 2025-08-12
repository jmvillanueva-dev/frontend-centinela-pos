import { useEffect, useState } from "react";
import useFetch from "../../../../hooks/useFetch.js";
import { toast } from "react-toastify";
import { ArrowLeft, User, Trash2 } from "lucide-react";

const BusinessDetail = ({ businessId, onBack }) => {
  const { fetchDataBackend } = useFetch();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState(null);

  const fetchBusinessDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/negocios/detail/${businessId}`;
      const response = await fetchDataBackend(url, null, "GET");
      if (response) {
        setBusiness(response);
      } else {
        setError("No se pudo cargar la información del negocio.");
        toast.error("No se pudo cargar la información del negocio.");
      }
    } catch (err) {
      console.error("Error fetching business detail:", err);
      setError("Error al cargar el detalle del negocio.");
      toast.error("Error al cargar el detalle del negocio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetail();
    }
  }, [businessId, fetchDataBackend]);

  const handleDeleteEmployee = async (employeeId) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar a este empleado? Esta acción no se puede deshacer."
      )
    ) {
      setDeletingEmployeeId(employeeId);
      try {
        const url = `https://pos-centinela-backend.onrender.com/api/negocios/delete-employee/${employeeId}`;
        await fetchDataBackend(url, null, "DELETE");
        toast.success("Empleado eliminado exitosamente.");

        // Actualizar el estado para remover al empleado de la lista
        setBusiness((prevBusiness) => ({
          ...prevBusiness,
          empleados: prevBusiness.empleados.filter(
            (emp) => emp._id !== employeeId
          ),
        }));
      } catch (err) {
        console.error("Error deleting employee:", err);
        toast.error(
          "Error al eliminar el empleado. Por favor, inténtalo de nuevo."
        );
      } finally {
        setDeletingEmployeeId(null);
      }
    }
  };

  if (loading) {
    return <p>Cargando detalle del negocio...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Detalle del Negocio</h2>
      </div>

      {business && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  src={business.logo || "https://via.placeholder.com/150"}
                  alt="Logo del negocio"
                  className="w-20 h-20 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold">{business.companyName}</h3>
                  <p className="text-gray-500">{business.companyCode}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">RUC:</p>
                <p>{business.ruc}</p>
              </div>
              <div>
                <p className="font-semibold">Categoría:</p>
                <p>{business.categoria}</p>
              </div>
              <div>
                <p className="font-semibold">Teléfono:</p>
                <p>{business.telefono}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Dirección:</p>
                <p>{business.direccion}</p>
              </div>
              <div>
                <p className="font-semibold">Email del negocio:</p>
                <p>{business.emailNegocio}</p>
              </div>
              <div>
                <p className="font-semibold">Descripción:</p>
                <p>{business.descripcion || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Propietario:</p>
                <p>
                  {business.emailBoss.nombres} {business.emailBoss.apellidos}
                </p>
                <p className="text-sm text-gray-500">
                  {business.emailBoss.email}
                </p>
              </div>
            </div>
          </div>
          <hr className="my-6" />
          <h3 className="text-xl font-bold mb-4">Empleados Asociados</h3>
          {business.empleados && business.empleados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {business.empleados.map((employee) => (
                <div
                  key={employee._id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm"
                >
                  <User size={20} className="text-gray-500 mr-3" />
                  <div className="flex-grow">
                    <p className="font-medium">
                      {employee.nombres} {employee.apellidos}
                    </p>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEmployee(employee._id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                    disabled={deletingEmployeeId === employee._id}
                    title="Eliminar empleado"
                  >
                    {deletingEmployeeId === employee._id ? (
                      <span className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full"></span>
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No hay empleados asociados a este negocio.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BusinessDetail;
