import axios from "axios"
import Cookies from "js-cookie"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
axios.defaults.timeout = 240000

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor de errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expira
    if (error.response?.status === 401) {
      console.warn("Sesión expirada. Cerrando sesión...")
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        Cookies.remove("auth_token")
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)
export default api;