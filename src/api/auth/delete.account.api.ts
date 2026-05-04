import { useMutation } from '@tanstack/react-query'
import apiClient from '../main.api'
import { DELETE_ACCOUNT } from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'

export type DeleteAccountDto = {
  password: string
}

export const deleteAccount = async (dto: DeleteAccountDto) => {
  try {
    const response = await apiClient.post(
      DELETE_ACCOUNT,
      { password: dto.password },
      { withCredentials: true },
    )
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccount,
  })
}

