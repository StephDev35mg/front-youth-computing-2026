import apiClient from '../main.api'
import { GET_ZONES} from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'
import { useQuery } from '@tanstack/react-query'

export interface Zone {
  id: string
  quartier?: string
  address: string
  message?: string
}

export const getAllZones = async (): Promise<Zone[]> => {
  try {
    const response = await apiClient.get(GET_ZONES, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

export const useGetZones = () => {
  return useQuery<Zone[]>({
    queryKey: ['zones'],
    queryFn: getAllZones,
  })
}   