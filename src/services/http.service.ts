import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { TokenService } from './token.service'

export class HttpService {
  private static instance: AxiosInstance
  private static isRefreshing = false
  private static refreshSubscribers: ((token: string) => void)[] = []

  private static subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb)
  }

  private static onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token))
    this.refreshSubscribers = []
  }

  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      this.setupInterceptors()
    }

    return this.instance
  }

  private static setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const tokens = TokenService.getStoredTokens()
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.subscribeTokenRefresh((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(this.instance(originalRequest))
              })
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const tokens = await TokenService.refreshTokens()
            if (tokens) {
              this.onTokenRefreshed(tokens.access_token)
              originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`
              return this.instance(originalRequest)
            }
          } catch (refreshError) {
            TokenService.clearTokens()
            window.location.href = '/login'
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  public static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().get(url, config)
    return response.data
  }

  public static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().post(url, data, config)
    return response.data
  }

  public static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().put(url, data, config)
    return response.data
  }

  public static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().delete(url, config)
    return response.data
  }
}
