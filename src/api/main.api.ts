import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { API_BASE_URL_APP, AUTH_REFRESH } from '@/constants/api.constant'
import { store } from '@/redux/store'
import { logout, setAuth } from '@/redux/slices/client.slice'
import type { UserData } from '@/interface/user.interface'

let navigate: ((to: string) => void) | null = null
export const setNavigate = (navFn: (to: string) => void) => (navigate = navFn)

const createClient = () =>
  axios.create({
    baseURL: API_BASE_URL_APP,
    timeout: 10000,
    withCredentials: true,
  })

const apiClient = createClient()
const refreshClient = createClient()

const getAccessToken = () => store.getState().client.token?.access

const setAuthorization = (config: AxiosRequestConfig, token: string) => {
  config.headers = config.headers ?? {}
  ;(config.headers as any).Authorization = `Bearer ${token}`
}

let refreshPromise: Promise<void> | null = null

const refreshAccessToken = async () => {
  refreshPromise ??= refreshClient
    .post<{ access: string; user: UserData }>(AUTH_REFRESH)
    .then(({ data }) => {
      if (!data.access) throw new Error('Invalid refresh response')
      store.dispatch(setAuth(data))
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) setAuthorization(config, token)
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean }
    const isRefresh = original?.url?.includes(AUTH_REFRESH)

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isRefresh
    ) {
      original._retry = true

      try {
        await refreshAccessToken()

        const newToken = getAccessToken()
        if (newToken) setAuthorization(original, newToken)

        return apiClient(original)
      } catch {
        handleLogout()
      }
    }

    if (error.response?.status === 401 && isRefresh) {
      handleLogout()
    }

    return Promise.reject(error)
  },
)

const handleLogout = () => {
  store.dispatch(logout())
  navigate?.('/signIn')
}

export default apiClient
