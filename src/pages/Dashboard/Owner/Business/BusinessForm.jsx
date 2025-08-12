import { useForm } from "react-hook-form";
import {
  X,
  Save,
  Building,
  Phone,
  MapPin,
  Mail,
  AlignLeft,
  Image,
  Tags,
  User,
} from "lucide-react";
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-95 md:scale-100">
        <div className="sticky top-0 bg-white p-6 md:p-8 border-b border-gray-200 flex justify-between items-center z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
            {initialData ? "Actualizar Negocio" : "Registrar Nuevo Negocio"}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Cerrar formulario"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          {/* Section: Información del negocio */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-700 flex items-center">
              <Building size={20} className="mr-2 text-blue-500" />
              Detalles del Negocio
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre del negocio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del negocio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("companyName", {
                      required: "Este campo es obligatorio",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                    })}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Ej: Delicias Andinas"
                  />
                  <Building
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in-down">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              {/* RUC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RUC <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("ruc", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[0-9]{13}$/,
                        message: "RUC debe tener 13 dígitos",
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.ruc ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Ej: 17999887766001"
                  />
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                {errors.ruc && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in-down">
                    {errors.ruc.message}
                  </p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("categoria", {
                      required: "Seleccione una categoría",
                    })}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.categoria ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none`}
                  >
                    <option value="">Seleccione una categoría...</option>
                    <option value="Alimentos">Alimentos</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Ropa">Ropa</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Otros">Otros</option>
                  </select>
                  <Tags
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                {errors.categoria && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in-down">
                    {errors.categoria.message}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    {...register("telefono", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Teléfono debe tener 10 dígitos",
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.telefono ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Ej: 0987654321"
                  />
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in-down">
                    {errors.telefono.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Separador */}
          <hr className="my-8 border-gray-200" />

          {/* Section: Información de contacto y otros */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-700 flex items-center">
              <MapPin size={20} className="mr-2 text-blue-500" />
              Contacto y Extras
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("direccion", {
                      required: "Este campo es obligatorio",
                      minLength: { value: 5, message: "Mínimo 5 caracteres" },
                    })}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.direccion ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Ej: Calle Venezuela 123"
                  />
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                {errors.direccion && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in-down">
                    {errors.direccion.message}
                  </p>
                )}
              </div>

              {/* Email del negocio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email del negocio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register("emailNegocio", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.emailNegocio ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="Ej: info@negocio.com"
                  />
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                {errors.emailNegocio && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in-down">
                    {errors.emailNegocio.message}
                  </p>
                )}
              </div>
            </div>

            {/* Descripción y Logo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <div className="relative">
                  <textarea
                    {...register("descripcion", {
                      maxLength: {
                        value: 200,
                        message: "Máximo 200 caracteres",
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.descripcion ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    rows="4"
                    placeholder="Breve descripción del negocio (opcional)"
                  />
                  <AlignLeft
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                </div>
                {errors.descripcion && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in-down">
                    {errors.descripcion.message}
                  </p>
                )}
              </div>

              {/* Logo del negocio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo del negocio
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border border-dashed border-gray-300">
                    <Image size={24} className="text-gray-400" />
                  </div>
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    <span>Subir archivo</span>
                    <input
                      type="file"
                      {...register("image")}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-10 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <X size={18} className="mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-[var(--color-blue-velvet)] text-white rounded-lg hover:bg-[var(--color-blue-velvet)]/90 transition-colors"
            >
              <Save size={18} className="mr-2" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;
