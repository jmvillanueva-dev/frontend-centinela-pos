import { useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import storeAuth from "../context/storeAuth.jsx"; // Asegúrate de que la ruta sea correcta

/**
 * @hook
 * @description Hook personalizado para realizar peticiones al backend con autenticación.
 */
function useFetch() {
  // Usamos useRef para mantener una referencia constante del store,
  // evitando que useCallback re-cree la función si storeAuth cambia.
  const storeRef = useRef(storeAuth);

  /**
   * @function fetchDataBackend
   * @description Realiza una petición GET, POST o PUT al backend, incluyendo el token de autenticación.
   * @param {string} url La URL del endpoint.
   * @param {object|FormData} [data=null] Los datos a enviar en la petición (para POST y PUT).
   * @param {string} [method="POST"] El método HTTP a utilizar ("POST", "GET" o "PUT").
   * @returns {Promise<object>} Los datos de la respuesta.
   */
  const fetchDataBackend = useCallback(
    async (url, data = null, method = "POST") => {
      try {
        const { token } = storeRef.current.getState();

        const headers = {
          ...(token && { Authorization: `Bearer ${token}` }),
        };

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
          respuesta = await axios.put(url, data, { headers });
        } else {
          throw new Error("Método HTTP no soportado: " + method);
        }

        return respuesta?.data;
      } catch (error) {
        console.error("Error en fetchDataBackend:", error);
        const errorMsg = error.response?.data?.msg || "Error con el servidor";
        // toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    },
    [] // Array de dependencias vacío para que la función sea la misma en cada render.
  );

  return { fetchDataBackend };
}

export default useFetch;
