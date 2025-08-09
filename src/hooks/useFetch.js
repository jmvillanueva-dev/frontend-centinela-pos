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
   * @description Realiza una petición GET o POST al backend, incluyendo el token de autenticación.
   * @param {string} url La URL del endpoint.
   * @param {object} [from=null] Los datos a enviar en la petición (solo para POST).
   * @param {string} [method="POST"] El método HTTP a utilizar ("POST" o "GET").
   * @returns {Promise<object>} Los datos de la respuesta.
   */
  const fetchDataBackend = async (url, from = null, method = "POST") => {
    try {
      // Obtener el token del store de Zustand
      const { token } = storeAuth.getState();
      console.log("Token:", token);

      // Configurar los encabezados de la petición, incluyendo el token si existe
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // Añadir el token solo si está presente
      };

      let respuesta;
      if (method.toUpperCase() === "POST") {
        respuesta = await axios.post(url, from, { headers });
      } else if (method.toUpperCase() === "GET") {
        respuesta = await axios.get(url, { headers });
      } else {
        throw new Error("Método HTTP no soportado: " + method);
      }

      toast.success(respuesta?.data?.msg);
      return respuesta?.data;
    } catch (error) {
      console.error("Error en fetchDataBackend:", error);
      const errorMsg = error.response?.data?.msg || "Error con el servidor";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };
  return { fetchDataBackend };
}

export default useFetch;
