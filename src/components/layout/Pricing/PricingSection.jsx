import { Check, Zap, BarChart, Users, ShoppingCart, Building2 , MessagesSquare  } from "lucide-react";
import { useState } from "react";

export default function PricingSection() {
const [selectedPlan, setSelectedPlan] = useState("business"); // Business preseleccionado

const plans = [
{
    id: "starter",
    name: "Starter",
    price: "Gratis",
    description: "Perfecto para comenzar y probar nuestras funcionalidades básicas",
    features: [
    "Sistema POS completo (CRUD)",
    "15 días de prueba del módulo de IA",
    "Registro de 1 local/negocio",
    "Soporte básico por correo",
    "Actualizaciones de seguridad"
    ],
    cta: "Comenzar gratis",
    color: "from-blue-velvet/10 to-blue-velvet/30",
    textColor: "text-blue-velvet"
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
    "Integración con herramientas externas"
    ],
    cta: "Prueba 7 días gratis",
    color: "from-teal-tide/20 to-teal-tide/40",
    textColor: "text-teal-600",
    popular: true // Destacar este plan como popular
},
{
    id: "enterprise",
    name: "Enterprise",
    price: "Personalizado",
    description: "Solución completa para cadenas y franquicias",
    features: [
    "Todo en el plan Business",
    "Locales ilimitados",
    "Dashboard ejecutivo",
    "API completa para desarrolladores",
    "Entrenamiento personalizado de IA",
    "Soporte VIP 24/7",
    "Gerente de cuenta dedicado",
    "Migración asistida"
    ],
    cta: "Contactar ventas",
    color: "from-tangerine/20 to-tangerine/40",
    textColor: "text-tangerine"
}
];

const handlePlanSelect = (planId) => {
setSelectedPlan(planId);
};

return (
<section id="pricing" className="py-20 bg-white">
    <div className="container mx-auto px-4">
    {/* Encabezado */}
    <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-obsidian">
        Precios que <span className="bg-gradient-to-r from-teal-tide to-blue-velvet bg-clip-text text-transparent">crecen</span> con tu negocio
        </h2>
        <p className="text-xl text-slate-600">
        Desde emprendedores hasta grandes cadenas, tenemos el plan perfecto para potenciar tus ventas
        </p>
    </div>

    {/* Tarjetas de precios */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
        <div 
            key={plan.id}
            onClick={() => handlePlanSelect(plan.id)}
            className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
            selectedPlan === plan.id 
                ? "border-teal-tide shadow-xl transform md:-translate-y-2"
                : "border-gray-200 hover:border-teal-tide/50"
            }`}
        >
            {plan.popular && (
            <div className="absolute top-0 right-0 bg-teal-tide text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                ¡MÁS POPULAR!
            </div>
            )}
            
            <div className={`p-8 bg-gradient-to-br ${plan.color}`}>
            <h3 className={`text-2xl font-bold mb-2 ${plan.textColor}`}>{plan.name}</h3>
            <div className="flex items-end mb-4">
                <span className="text-4xl font-bold text-obsidian">{plan.price}</span>
                {plan.period && <span className="text-lg text-slate-500 ml-1">{plan.period}</span>}
            </div>
            <p className="text-slate-600 mb-6">{plan.description}</p>
            
            <button 
                className={`w-full py-3 px-6 rounded-lg font-semibold mb-8 transition-all ${
                selectedPlan === plan.id
                    ? "bg-blue-velvet text-white hover:shadow-lg hover:shadow-teal-tide/30"
                    : "bg-white text-obsidian border border-gray-300 hover:border-teal-tide"
                }`}
            >
                {plan.cta}
            </button>
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

    {/* Comparativa */}
    <div className="mt-20 bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-center text-obsidian mb-8">Comparativa de características</h3>
        
        <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
            <tr className="border-b border-gray-200">
                <th className="pb-4 text-left font-semibold text-slate-700">Características</th>
                {plans.map((plan) => (
                <th 
                    key={plan.id} 
                    className={`pb-4 text-center font-semibold ${
                    selectedPlan === plan.id ? "text-teal-tide" : "text-slate-700"
                    }`}
                >
                    {plan.name}
                </th>
                ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            <tr>
                <td className="py-4 text-slate-600 flex items-center">
                <ShoppingCart className="mr-2 text-blue-velvet" /> Sistema POS
                </td>
                {plans.map((plan) => (
                <td key={plan.id} className="py-4 text-center">
                    <Check className="w-5 h-5 text-teal-tide mx-auto" />
                </td>
                ))}
            </tr>
            <tr>
                <td className="py-4 text-slate-600 flex items-center">
                <BarChart className="mr-2 text-teal-tide" /> Análisis de ventas
                </td>
                <td className="py-4 text-center text-slate-400">—</td>
                {plans.slice(1).map((plan) => (
                <td key={plan.id} className="py-4 text-center">
                    <Check className="w-5 h-5 text-teal-tide mx-auto" />
                </td>
                ))}
            </tr>
            <tr>
                <td className="py-4 text-slate-600 flex items-center">
                <Users className="mr-2 text-tangerine" /> Gestión de empleados
                </td>
                <td className="py-4 text-center text-slate-400">—</td>
                {plans.slice(1).map((plan) => (
                <td key={plan.id} className="py-4 text-center">
                    <Check className="w-5 h-5 text-teal-tide mx-auto" />
                </td>
                ))}
            </tr>
            <tr>
                <td className="py-4 text-slate-600 flex items-center">
                <Building2 className="mr-2 text-purple-500" /> Locales permitidos
                </td>
                <td className="py-4 text-center text-slate-600">1</td>
                <td className="py-4 text-center text-slate-600">3</td>
                <td className="py-4 text-center text-slate-600">Ilimitados</td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

    {/* Nota final con botón de WhatsApp */}
    <div className="mt-12 text-center">
        <p className="text-slate-600 mb-6">¿Necesitas algo personalizado? Contáctanos para crear un plan a tu medida.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
                href="https://wa.me/593995910820?text=Hola%20CentilenaPOS,%20necesito%20un%20plan%20personalizado"
                target="_blank"
                rel="noopener noreferrer"
                className=" group inline-flex items-center justify-center px-6 py-3 bg-blue-velvet text-white font-semibold rounded-lg hover:bg-blue-700 transition-transform duration-300 shadow-lg hover:scale-105"
            >
                <MessagesSquare className="mr-2 group-hover:animate-pulse group-hover:scale-120 transition-transform duration-300" />
                Chatea con nosotros
            </a>
        </div>
        <p className="mt-6 text-sm text-slate-500">Todos los planes incluyen garantía de satisfacción de 30 días.</p>
    </div>
    </div>
</section>
);
}