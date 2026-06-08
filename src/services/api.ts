import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, API_VERSION } from '../utils/constants'
import { storage } from '../utils/storage'
import { isTokenExpired } from '../utils/jwt'

const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken()
 
    if (token) {
      if (isTokenExpired(token)) {
        storage.clearAuth()
        window.location.href = '/login'
        return Promise.reject(new Error('Token expirado'))
      }
      config.headers.Authorization = `Bearer ${token}`
    }

    config.headers['X-Correlation-ID'] = crypto.randomUUID()
 
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
 
export default api

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await api.get<T>(url, { params })
  return response.data
}
 
export async function post<T>(url: string, data?: unknown): Promise<T> {
  const response = await api.post<T>(url, data)
  return response.data
}
 
export async function put<T>(url: string, data?: unknown): Promise<T> {
  const response = await api.put<T>(url, data)
  return response.data
}
 
export async function patch<T>(url: string, data?: unknown): Promise<T> {
  const response = await api.patch<T>(url, data)
  return response.data
}
 
export async function del<T>(url: string): Promise<T> {
  const response = await api.delete<T>(url)
  return response.data
}
 
export async function postForm<T>(url: string, formData: FormData): Promise<T> {
  const response = await api.post<T>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}