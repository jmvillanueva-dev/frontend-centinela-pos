import { useCallback, useRef } from "react";
import axios from "axios";
import storeAuth from "../context/storeAuth.jsx";

/**
 * @hook
 * @description Hook personalizado para realizar peticiones al backend con autenticación.
 */
function useFetch() {
  const storeRef = useRef(storeAuth);

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

        const methodUpperCase = method.toUpperCase();
        let respuesta;

        if (methodUpperCase === "POST") {
          respuesta = await axios.post(url, data, { headers });
        } else if (methodUpperCase === "GET") {
          respuesta = await axios.get(url, { headers });
        } else if (methodUpperCase === "PUT") {
          respuesta = await axios.put(url, data, { headers });
        } else if (methodUpperCase === "DELETE") {
          respuesta = await axios.delete(url, { headers });
        } else {
          throw new Error("Método HTTP no soportado: " + method);
        }

        return respuesta?.data;
      } catch (error) {
        console.error("Error en fetchDataBackend:", error);

        const errorMsg =
          error.response?.data?.msg ||
          error.message ||
          "Error con el servidor. Inténtalo de nuevo.";

        throw { message: errorMsg };
      }
    },
    []
  );

  return { fetchDataBackend };
}

export default useFetch;
