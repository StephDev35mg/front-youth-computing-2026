import apiClient from '../main.api'
import { VERIFY_OTP } from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'
import type { UserData } from '@/interface/user.interface'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'
import { setAuth } from '@/redux/slices/client.slice'

export interface ConfirmOtpDto {
  email: string
  otp: string
}

export type ConfirmSignInResponse = {
  access: string
  refresh?: string
  user: UserData
}

export const confirmSignIn = async (
  confirmDto: ConfirmOtpDto,
): Promise<ConfirmSignInResponse> => {
  try {
    const response = await apiClient.post<ConfirmSignInResponse>(
      VERIFY_OTP,
      confirmDto,
      {
        withCredentials: true,
      },
    )
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

export const useConfirmSignIn = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const handleSuccess = async (data: ConfirmSignInResponse) => {
    dispatch(setAuth({ access: data.access, user: data.user }))
    router.navigate({ to: '/dashboard', search: { connected: true } })
  }

  return useMutation({
    mutationFn: confirmSignIn,
    onSuccess: handleSuccess,
  })
}
