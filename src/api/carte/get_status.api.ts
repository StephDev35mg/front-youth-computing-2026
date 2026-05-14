import apiClient from '../main.api'
import { GET_ZONE_STATUS } from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'
import { useQuery } from '@tanstack/react-query'

export interface ZONE_STATUS {
  id: number

  zone: number

  service_type: 'WATER' | 'ELECTRICITY'

  status: 'CRITICAL' | 'MEDIUM' | 'NORMAL'

  availability_score: number

  updated_at: string
}

export const getAllZoneStatus = async (): Promise<ZONE_STATUS[]> => {
  try {
    const response = await apiClient.get(GET_ZONE_STATUS, {
      withCredentials: true,
    })

    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

export const useGetZoneStatus = () => {
  return useQuery<ZONE_STATUS[]>({
    queryKey: ['zone-status'],
    queryFn: getAllZoneStatus,
  })
}