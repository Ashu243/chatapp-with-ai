import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

function capitalize(value) {
  if (typeof value !== "string") return "";
  if (value.length === 0) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// interceptors are middlemen who sits between frontend code and backend response
// It can see, modify, or handle the response before your code gets it.
// API -> interceptors -> component.
// axios has two types of interceptors, request( runs before goes to backend) and response( runs after backend sends a response)
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

export default axiosClient