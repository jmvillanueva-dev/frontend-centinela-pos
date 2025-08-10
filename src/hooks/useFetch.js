import axios from "axios";
import { toast } from "react-toastify";
import storeAuth from "../context/storeAuth.jsx"; // Asegúrate de que la ruta sea correcta

/**
 * @hook
 * @description Hook personalizado para realizar peticiones al backend con autenticación.
 */
function useFetch() {
  /**
   * @function fetchDataBackend
   * @description Realiza una petición GET, POST o PUT al backend, incluyendo el token de autenticación.
   * @param {string} url La URL del endpoint.
   * @param {object|FormData} [data=null] Los datos a enviar en la petición (para POST y PUT).
   * @param {string} [method="POST"] El método HTTP a utilizar ("POST", "GET" o "PUT").
   * @returns {Promise<object>} Los datos de la respuesta.
   */
  const fetchDataBackend = async (url, data = null, method = "POST") => {
    try {
      // Obtener el token del store de Zustand
      const { token } = storeAuth.getState();

      // Configurar los encabezados de la petición, incluyendo el token si existe.
      // Se ajusta el Content-Type para peticiones que no son de tipo FormData.
      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }), // Añadir el token solo si está presente
      };

      // Si los datos son de tipo FormData, Axios se encarga de establecer el Content-Type adecuado.
      // De lo contrario, se usa application/json.
      if (!(data instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      let respuesta;
      const methodUpperCase = method.toUpperCase();

      if (methodUpperCase === "POST") {
        respuesta = await axios.post(url, data, { headers });
      } else if (methodUpperCase === "GET") {
        respuesta = await axios.get(url, { headers });
      } else if (methodUpperCase === "PUT") {
        // Manejo específico para solicitudes PUT
        respuesta = await axios.put(url, data, { headers });
      } else {
        throw new Error("Método HTTP no soportado: " + method);
      }

      // toast.success(respuesta?.data?.msg);
      return respuesta?.data;
    } catch (error) {
      console.error("Error en fetchDataBackend:", error);
      const errorMsg = error.response?.data?.msg || "Error con el servidor";
      // toast.error(errorMsg);
      // Re-lanzar el error para que los componentes puedan manejarlo si es necesario
      throw new Error(errorMsg);
    }
  };
  return { fetchDataBackend };
}

export default useFetch;
