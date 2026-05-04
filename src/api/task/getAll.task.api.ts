import apiClient from '../main.api'
import { GET_TASKS } from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'
import { useQuery } from '@tanstack/react-query'
export const getAllTasks = async () => {
  try {
    const response = await apiClient.get(GET_TASKS, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

export const useGetTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getAllTasks,
  })
}
