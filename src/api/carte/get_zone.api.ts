import apiClient from '../main.api'
import { GET_ZONES } from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'
import { useQuery } from '@tanstack/react-query'

/**
 * TYPE ZONE
 */
export interface ZONE {
  id: number
  quartier: string
  address: string
  latitude: number
  longitude: number
  created_at: string
}

/**
 * FETCH ZONES
 */
export const getAllZones = async (): Promise<ZONE[]> => {
  try {
    const response = await apiClient.get(GET_ZONES, {
      withCredentials: true,
    })

    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

/**
 * REACT QUERY HOOK
 */
export const useGetZones = () => {
  return useQuery<ZONE[]>({
    queryKey: ['zones'],
    queryFn: getAllZones,
  })
}
