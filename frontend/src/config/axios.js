import axios from "axios";
import { toast } from "react-toastify";

/**
 * Axios instance
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // required for cookies (access + refresh token)
});


// Capitalize helper (for toast messages)

function capitalize(value) {
  if (typeof value !== "string") return "";
  if (value.length === 0) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * RESPONSE INTERCEPTOR
 * Runs AFTER backend sends response
 */
axiosClient.interceptors.response.use(
    (response)=>{
        if(response.config.show && response.data?.message){

            toast.success(capitalize(response.data.message))
        }
        return response
    },
    (error)=>{
        if(error.config?.skip){
            return Promise.reject(error)
        }
        const message = error.response?.data?.message || 'Something went worng, Please try again later'
        toast.error(message)
        return Promise.reject(error)
    }
    
)

export default axiosClient;
