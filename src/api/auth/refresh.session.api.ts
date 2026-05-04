import axios from 'axios'
import { API_BASE_URL_APP, AUTH_REFRESH } from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'
import type { UserData } from '@/interface/user.interface'

export type RefreshSessionResponse = {
  access: string
  user: UserData
}

const refreshClient = axios.create({
  baseURL: API_BASE_URL_APP,
  timeout: 10000,
  withCredentials: true,
})

// Cookie-based refresh: backend lit le refresh token depuis un cookie HttpOnly
export const refreshSession = async (): Promise<RefreshSessionResponse> => {
  try {
    const response = await refreshClient.post<RefreshSessionResponse>(
      AUTH_REFRESH,
      {},
    )
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}
