import { API_BASE_URL_APP, AUTH_REFRESH } from '@/constants/api.constant'
import { store } from '@/redux/store'
import { logout, setAuth } from '@/redux/slices/client.slice'
import type { UserData } from '@/interface/user.interface'
import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

let navigate: ((to: string) => void) | null = null

export const setNavigate = (navFn: (to: string) => void) => {
  navigate = navFn
}

const apiClient = axios.create({
  baseURL: API_BASE_URL_APP,
  timeout: 10000,
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL: API_BASE_URL_APP,
  timeout: 10000,
  withCredentials: true,
})

let refreshPromise: Promise<void> | null = null

const ensureFreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await refreshClient.post<{ access: string; user: UserData }>(
        AUTH_REFRESH,
        {},
      )
      const { access, user } = response.data
      if (typeof access !== 'string') {
        throw new Error('Invalid refresh response: missing access token')
      }
      store.dispatch(setAuth({ access, user }))
    })().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

// Request interceptor: attach access token (in-memory)
apiClient.interceptors.request.use(
  async (config) => {
    const token = store.getState().client.token?.access
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as any).Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: on 401 -> try refresh cookie once, retry request
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as (AxiosRequestConfig & {
      _retry?: boolean
    })

    const url = String(originalConfig?.url ?? '')
    const isRefreshCall = url.includes(AUTH_REFRESH)

    if (
      !isRefreshCall &&
      error.response?.status === 401 &&
      originalConfig &&
      !originalConfig._retry
    ) {
      originalConfig._retry = true

      try {
        await ensureFreshAccessToken()

        const newToken = store.getState().client.token?.access
        if (newToken) {
          originalConfig.headers = originalConfig.headers ?? {}
          ;(originalConfig.headers as any).Authorization = `Bearer ${newToken}`
        }

        return apiClient(originalConfig)
      } catch {
        store.dispatch(logout())
        if (navigate) navigate('/signIn')
        return Promise.reject(error)
      }
    }

    if (error.response?.status === 401 && isRefreshCall) {
      store.dispatch(logout())
      if (navigate) navigate('/signIn')
    }

    return Promise.reject(error)
  },
)

export default apiClient
