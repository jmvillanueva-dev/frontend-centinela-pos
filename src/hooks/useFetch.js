import axios from "axios";
import { toast } from "react-toastify";

function useFetch() {

    const fetchDataBackend = async (url, from = null, method = "POST") => {
        try{
            let respuesta
            if (method == 'POST'){
                respuesta = await axios.post(url, from)
            }
            else if (method == 'GET') {
                respuesta = await axios.get(url)
            }
            toast.success(respuesta?.data?.msg)
            return respuesta?.data

        } catch (error){
            console.log();
            toast.error(error.response?.data?.msg)
            const errorMsg = error.response?.data?.msg || 'Error con el servidor'
            throw new Error (errorMsg)
        }
    }
    return {fetchDataBackend}
}

export default useFetch;
