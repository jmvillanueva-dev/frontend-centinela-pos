import { useForm } from "react-hook-form";
import { X, Save } from "lucide-react";
import { useEffect } from "react";

const BusinessForm = ({ initialData, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData || {
      companyName: "",
      ruc: "",
      categoria: "",
      telefono: "",
      direccion: "",
      emailNegocio: "",
      descripcion: "",
      image: null,
    },
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">
            {initialData ? "Actualizar Negocio" : "Registrar Nuevo Negocio"}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del negocio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("companyName", {
                    required: "Este campo es obligatorio",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Delicias Andinas"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RUC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("ruc", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^[0-9]{13}$/,
                      message: "RUC debe tener 13 dígitos",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 17999887766001"
                />
                {errors.ruc && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.ruc.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("categoria", {
                    required: "Seleccione una categoría",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione una categoría...</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Otros">Otros</option>
                </select>
                {errors.categoria && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.categoria.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("telefono", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Teléfono debe tener 10 dígitos",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 0987654321"
                />
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.telefono.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("direccion", {
                    required: "Este campo es obligatorio",
                    minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Calle Venezuela 123"
                />
                {errors.direccion && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.direccion.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email del negocio <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("emailNegocio", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: info@negocio.com"
                />
                {errors.emailNegocio && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.emailNegocio.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  {...register("descripcion", {
                    maxLength: { value: 200, message: "Máximo 200 caracteres" },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Breve descripción del negocio (opcional)"
                />
                {errors.descripcion && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.descripcion.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo del negocio
                </label>
                <input
                  type="file"
                  {...register("image")} // Campo de carga de archivo
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--color-blue-velvet)] text-white rounded-lg hover:bg-[var(--color-blue-velvet)]/90 transition-colors"
            >
              <Save size={16} className="inline mr-2" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;
