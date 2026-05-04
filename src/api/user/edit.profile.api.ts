import apiClient from '../main.api'
import { AxiosErrorCustom } from '../axios.error.custom'
import { useMutation } from '@tanstack/react-query'
import {EDIT_PROFILE} from '@/constants/api.constant'

export interface EditProfileDto {
  email: string
  password: string
  username?: string
  photo?: File
}
export const editProfile = async (editDto: EditProfileDto) => {
  try {
    const response = await apiClient.post(EDIT_PROFILE, editDto, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}


export const useEditProfile = () => {
  return useMutation({
    mutationFn: editProfile,
  })
}
