import apiClient from '../main.api'
import { useQuery } from '@tanstack/react-query'
import { AxiosErrorCustom } from '../axios.error.custom'

export const GET_ZONE_STATUS = 'zone-status/get_zone_status/'

export type ZoneStatus = {
  id: number
  service_type: 'WATER' | 'ELECTRICITY'
  availability_score: string
  status: 'NORMAL' | 'MEDIUM' | 'CRITICAL'
  updated_at: string
  zone: number
}

export const getZoneStatus = async (): Promise<ZoneStatus[]> => {
  try {
    const response = await apiClient.get(GET_ZONE_STATUS)

    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

export const useGetZoneStatus = () => {
  return useQuery<ZoneStatus[], AxiosErrorCustom>({
    queryKey: ['zone-status'],

    queryFn: getZoneStatus,

    refetchInterval: 10000,

    refetchOnWindowFocus: false,

    staleTime: 5000,
  })
}