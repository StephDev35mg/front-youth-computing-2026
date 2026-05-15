import apiClient from '../main.api'
import { GET_REPORTS} from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'
import { useQuery } from '@tanstack/react-query'


export interface REPORT {
  id: number | string
  zone?: string | number | { name?: string; title?: string; zone?: string }
  service_type?: 'WATER' | 'ELECTRICITY' | string
  status?: 'AVAILABLE' | 'NOT_AVAILABLE' | string
  description?: string | null
  created_at?: string
}

export const getAllReports = async (): Promise<REPORT[]> => {
  try {
    const response = await apiClient.get(GET_REPORTS, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

export const useGetReports = () => {
  return useQuery<REPORT[]>({
    queryKey: ['reports'],
    queryFn: getAllReports,
  })
}   