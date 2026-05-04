import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import apiClient from '../main.api'
import { AUTH_SIGN_IN } from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'

import { useDispatch } from 'react-redux'
import { setAuth, setPendingIdentity } from '@/redux/slices/client.slice'
import type { UserData } from '@/interface/user.interface'

export interface SignInDto {
  email: string
  password: string
  username?: string
}

type SignInResponse = { message: string } | { access: string; user: UserData }

const hasAccessToken = (data: SignInResponse): data is { access: string; user: UserData } => {
  return (
    typeof (data as any)?.access === 'string' &&
    typeof (data as any)?.user === 'object' &&
    (data as any)?.user !== null
  )
}

export const signInClient = async (signInDto: SignInDto): Promise<SignInResponse> => {
  try {
    const response = await apiClient.post<SignInResponse>(AUTH_SIGN_IN, signInDto, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

export const useSignInClient = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: signInClient,

    onSuccess: (data, variables) => {
      // API peut soit:
      // - envoyer un OTP (ex: { message: 'OTP envoyé' })
      // - ou renvoyer directement { access, user }
      if (hasAccessToken(data)) {
        dispatch(setAuth({ access: data.access, user: data.user }))
        router.navigate({ to: '/dashboard', search: { connected: true } })
        return
      }

      dispatch(
        setPendingIdentity({
          email: variables.email,
          username: variables.username,
        }),
      )

      router.navigate({ to: '/confirmSignIn', search: { otpSent: true } })
    },
  })
}
