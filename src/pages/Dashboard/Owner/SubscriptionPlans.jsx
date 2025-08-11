import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useFetch from "../../../hooks/useFetch.js";
import { Zap, Check, ArrowLeft } from "lucide-react";
import storeAuth from "../../../context/storeAuth.jsx";

/**
 * @component
 * @description Componente para mostrar los planes de suscripción y gestionar el pago con Stripe.
 */
const UpgradePlanPage = () => {
  const [plansData, setPlansData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { fetchDataBackend } = useFetch();

  const navigate = useNavigate();

  // Datos estáticos de los planes que ya tienes en tu web oficial
  const staticPlans = [
    {
      id: "starter",
      name: "Starter",
      price: "Gratis",
      description:
        "Perfecto para comenzar y probar nuestras funcionalidades básicas",
      features: [
        "Sistema POS completo (CRUD)",
        "15 días de prueba del módulo de IA",
        "Registro de 1 local/negocio",
        "Soporte básico por correo",
        "Actualizaciones de seguridad",
      ],
      cta: "Activar Plan Free",
      color: "from-blue-velvet/10 to-blue-velvet/30",
      textColor: "text-blue-velvet",
      disabled: false,
    },
    {
      id: "business",
      name: "Business",
      price: "$299",
      period: "/mes",
      description: "Ideal para negocios en crecimiento con múltiples locales",
      features: [
        "Todo en el plan Starter",
        "Análisis avanzado de ventas",
        "Seguimiento de rendimiento de empleados",
        "Registro de hasta 3 locales",
        "Soporte prioritario 24/5",
        "Reportes personalizados",
        "Integración con herramientas externas",
      ],
      cta: "Comprar Plan Business",
      color: "from-teal-tide/20 to-teal-tide/40",
      textColor: "text-teal-600",
      popular: true,
      priceId: "",
      disabled: false, // Ahora se maneja dinámicamente
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$599",
      period: "/mes",
      description: "Solución completa para cadenas y franquicias",
      features: [
        "Todo en el plan Business",
        "Locales ilimitados",
        "Dashboard ejecutivo",
        "API completa para desarrolladores",
        "Entrenamiento personalizado de IA",
        "Soporte VIP 24/7",
        "Gerente de cuenta dedicado",
        "Migración asistida",
      ],
      cta: "Comprar Plan Enterprise",
      color: "from-tangerine/20 to-tangerine/40",
      textColor: "text-tangerine",
      priceId: "",
      disabled: false, // Ahora se maneja dinámicamente
    },
  ];

  useEffect(() => {
    // Escucha los cambios en el store de Zustand para actualizar la UI
    const unsubscribe = storeAuth.subscribe(
      (state) => {
        const currentPlanId = state.user?.plan;

        // Mapear y combinar los datos cuando el plan del usuario cambie
        const updatedPlans = staticPlans.map((plan) => {
          // Si el plan del usuario coincide con el plan estático, actualiza el estado local del plan.
          if (currentPlanId && plan.id === currentPlanId) {
            return {
              ...plan,
              disabled: true,
              cta: "Plan Actual",
            };
          }

          // Si no es el plan actual, asegúrate de que el estado sea el predeterminado
          // Esto evita que "Plan Actual" se quede pegado si el usuario cambia de plan
          const defaultPlan = staticPlans.find((p) => p.id === plan.id);
          return {
            ...plan,
            disabled: defaultPlan.disabled,
            cta: defaultPlan.cta,
          };
        });

        setPlansData(updatedPlans);
      },
      (state) => state.user?.plan // Solo escucha los cambios en `user.plan`
    );

    const fetchPlans = async () => {
      try {
        setLoading(true);
        // 1. Obtener los precios de Stripe
        const plansUrl = `${import.meta.env.VITE_API_URL}/boss/plans`;
        const plansResponse = await fetchDataBackend(plansUrl, null, "GET");

        // 2. Mapear y combinar los datos con el plan actual del usuario.
        // Se asegura de que el estado de los planes se inicialice correctamente.
        const currentPlanId = storeAuth.getState().user?.plan;
        const updatedPlans = staticPlans.map((plan) => {
          if (plan.id === "business" || plan.id === "enterprise") {
            const stripePrice = plansResponse?.prices?.data.find(
              (p) =>
                p.nickname ===
                (plan.id === "business"
                  ? "Plan Business"
                  : "Plan Personalizado")
            );
            plan.priceId = stripePrice ? stripePrice.id : "";
          }
          if (currentPlanId && plan.id === currentPlanId) {
            return {
              ...plan,
              disabled: true,
              cta: "Plan Actual",
            };
          }
          return plan;
        });

        setPlansData(updatedPlans);
      } catch (err) {
        setError("No se pudieron cargar los planes de suscripción.");
        toast.error("Hubo un error al cargar los planes.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();

    return unsubscribe; // Limpia el listener de Zustand al desmontar el componente
  }, [fetchDataBackend]);

  /**
   * @function handleUpgrade
   * @description Llama a la API para iniciar el proceso de pago de Stripe.
   * @param {string} priceId El ID del precio de Stripe para el plan seleccionado.
   */
  const handleUpgrade = async (priceId) => {
    setIsProcessing(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/boss/plans/pago`;
      const response = await fetchDataBackend(url, { planId: priceId });
      if (response && response.url) {
        window.location.href = response.url; // Redirecciona a la URL de pago de Stripe
      } else {
        toast.error("No se pudo obtener la URL de pago.");
        setIsProcessing(false);
      }
    } catch (err) {
      setIsProcessing(false);
      console.log(err);
      toast.error("Error al procesar el pago.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Cargando planes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold">Error</h2>
        <p className="text-center">{error}</p>
        <button
          onClick={() => navigate("/dashboard/admin")}
          className="mt-4 px-4 py-2 bg-teal-tide text-obsidian rounded-lg hover:opacity-90"
        >
          Regresar
        </button>
      </div>
    );
  }

  const currentPlanId = storeAuth.getState().user?.plan;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8 text-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="w-full max-w-7xl">
        <div className="flex items-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full text-white hover:bg-gray-800 transition"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-4xl font-bold ml-4">
            Elige el Plan que Mejor se Adapte a ti
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plansData.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                plan.popular
                  ? "border-teal-tide shadow-xl transform md:-translate-y-2"
                  : plan.id === currentPlanId
                  ? "border-blue-velvet shadow-xl" // Estilo para el plan actual
                  : "border-gray-200"
              } ${
                plan.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:border-teal-tide/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-teal-tide text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  ¡MÁS POPULAR!
                </div>
              )}
              {plan.id === currentPlanId && (
                <div className="absolute top-0 right-0 bg-blue-velvet text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  PLAN ACTUAL
                </div>
              )}

              <div className={`p-8 bg-gradient-to-br ${plan.color}`}>
                <h3 className={`text-2xl font-bold mb-2 ${plan.textColor}`}>
                  {plan.name}
                </h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-lg text-slate-500 ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-white mb-6">{plan.description}</p>

                {plan.disabled ? (
                  <button
                    className="w-full py-3 px-6 rounded-lg font-semibold mb-8 transition-all bg-gray-500 text-white cursor-not-allowed"
                    disabled
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.priceId)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold mb-8 transition-all ${
                      plan.popular
                        ? "bg-teal-tide text-obsidian hover:shadow-lg hover:shadow-teal-tide/30"
                        : "bg-white text-obsidian border border-gray-300 hover:border-teal-tide"
                    }`}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Procesando..." : plan.cta}
                  </button>
                )}
              </div>

              <div className="p-8 bg-white">
                <h4 className="font-semibold text-lg text-slate-800 mb-4 flex items-center">
                  <Zap className={`mr-2 ${plan.textColor}`} />
                  Qué incluye:
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-slate-600">
                      <Check className="w-5 h-5 text-teal-tide mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * @component
 * @description Componente para mostrar el resultado de la transacción de Stripe.
 */
const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (success) {
      toast.success("¡Pago realizado con éxito! Tu plan se ha actualizado.");

      // Obtenemos el ID del precio de Stripe de los parámetros de la URL
      const priceId = searchParams.get("priceId");

      // Mapeamos el priceId de Stripe a un ID de plan interno
      let newPlanId = null;
      if (priceId) {
        const plans = [
          { id: "business", priceId: "tu_price_id_de_stripe_para_business" }, // Reemplaza con tus IDs reales
          {
            id: "enterprise",
            priceId: "tu_price_id_de_stripe_para_enterprise",
          }, // Reemplaza con tus IDs reales
        ];
        const purchasedPlan = plans.find((p) => p.priceId === priceId);
        if (purchasedPlan) {
          newPlanId = purchasedPlan.id;
        }
      }

      // Si se encuentra un nuevo plan, actualizamos el estado global de Zustand
      if (newPlanId) {
        storeAuth.setState((state) => ({
          user: { ...state.user, plan: newPlanId },
        }));
        // AHORA, PERSISTIMOS EL ESTADO ACTUALIZADO EN EL LOCAL STORAGE
        // Esto es crucial para que el estado persista al recargar la página
        const updatedUser = { ...storeAuth.getState().user, plan: newPlanId };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log(`Plan del usuario actualizado a: ${newPlanId}`);
        console.log("Estado del usuario guardado en localStorage.");
      } else {
        console.log(
          "No se pudo determinar el nuevo plan a partir del priceId."
        );
      }
    }
    if (canceled) {
      toast.info("Pago cancelado. Puedes intentarlo de nuevo.");
    }
  }, [success, canceled]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white p-4">
      {success && (
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-teal-tide">
            ¡Gracias por tu compra! 🎉
          </h2>
          <p className="mt-4 text-gray-300">
            Tu plan ha sido actualizado exitosamente. Ahora tienes acceso a
            todas las funcionalidades del plan Business.
          </p>
          <button
            onClick={() => navigate("/dashboard/admin")}
            className="mt-6 px-6 py-3 bg-teal-tide text-obsidian font-semibold rounded-lg hover:bg-teal-700 transition"
          >
            Volver al Panel Principal
          </button>
        </div>
      )}

      {canceled && (
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-orange-500">Pago Cancelado</h2>
          <p className="mt-4 text-gray-300">
            Tu transacción ha sido cancelada. Puedes regresar y seleccionar un
            plan para intentarlo de nuevo.
          </p>
          <button
            onClick={() => navigate("/dashboard/upgrade-plan")}
            className="mt-6 px-6 py-3 bg-white text-obsidian font-semibold rounded-lg border border-gray-300 hover:border-teal-tide transition"
          >
            Volver a los Planes
          </button>
        </div>
      )}
    </div>
  );
};

export { UpgradePlanPage, PaymentResultPage };
