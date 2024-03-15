import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

declare module 'axios' {
  interface AxiosResponse<T = any> {
    code?: string | number
    message?: string
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance
}

const instance = axios.create({
  baseURL: 'https://40d758v734.vicp.fun/terminal',
  timeout: 10000
})

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    if (response.data.code === 401) {
      ElMessage.error('登录超时，请重新登录')
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/#/login'
      return response
    } else {
      return response
    }
  },
  error => {
    return Promise.reject(error)
  }
)

interface Data {
  [index: string]: any
}
interface Http {
  get: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  getUrl: (url: string, data: string) => Promise<AxiosResponse>
  post: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  put: (url: string, data?: Data, config?: AxiosRequestConfig) => Promise<AxiosResponse>
  delete: (url: string, data: string) => Promise<AxiosResponse>
}

const http: Http = {
  get(url, data, config) {
    return instance.get(url, {
      params: data,
      ...config
    })
  },
  getUrl(url, data) {
    return instance.get(`${url}/${data}`)
  },
  post(url, data, config) {
    return instance.post(url, data, config)
  },
  delete(url, data) {
    return instance.delete(`${url}/${data}`)
  },
  put(url, data, config) {
    return instance.put(url, data, config)
  }
}

export default http
