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
    async (error)=>{
         // routes where refresh should NOT happen
    const skipRefreshRoutes = [
      "/api/users/login",
      "/api/users/refresh-token",
      "/api/users/profile",
    ]

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !skipRefreshRoutes.some(route => // some is used on array to check if at least one element passes a given test. return true or false
        originalRequest.url.includes(route)
      )
    ) {
      originalRequest._retry = true

      try {
        await axiosClient.post("/auth/refresh-token")
        return api(originalRequest)
      } catch {
        window.location.href = "/"
      }
    }
        console.log(error.config)
        if(error.config?.skip){
            return Promise.reject(error)
        }
        const message = error.response?.data?.message || 'Something went worng, Please try again later'
        toast.error(message)
        return Promise.reject(error)
    }
    
)

export default axiosClient