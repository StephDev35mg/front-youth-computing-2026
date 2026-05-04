import apiClient from '../main.api'
import { AUTH_SIGN_UP } from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

export interface RegisterDto {
  email: string
  password: string
  username?: string
}

export const registerAcount = async (registerDto: RegisterDto) => {
  try {
    const response = await apiClient.post(AUTH_SIGN_UP, registerDto, {
      withCredentials: true, 
    })
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

export const useRegisterAcount = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: registerAcount,
    onSuccess: (_data, variables) => {
      router.navigate({
        to: '/confirmRegister',
        search: { email: variables.email },
      })
    },
    onError: (error) => {
      console.error('Erreur inscription :', error)
    },
  })
}
