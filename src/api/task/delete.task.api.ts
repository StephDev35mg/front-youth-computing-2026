import apiClient from '../main.api'
import { AxiosErrorCustom } from '../axios.error.custom'
import { useMutation, useQueryClient } from '@tanstack/react-query'     
import {DELETE_TASK} from '@/constants/api.constant'
export const DeleteTask = async (id: number) => {
  try {
    const response = await apiClient.delete( `${DELETE_TASK}${id}/`,{
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: DeleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}