import { useMutation } from '@tanstack/react-query'
import apiClient from '../main.api'
import { LOGOUT } from '@/constants/api.constant'
import { AxiosErrorCustom } from '../axios.error.custom'
import { useRouter } from '@tanstack/react-router' // ou ton router si différent

// Fonction qui appelle le backend pour logout
export const logoutClient = async () => {
  try {
    const response = await apiClient.post(
      LOGOUT,
      {},
      {
        withCredentials: true, // important pour envoyer le cookie HttpOnly
      },
    )
    return response.data
  } catch (error) {
    throw new AxiosErrorCustom(error)
  }
}

// Hook React Query pour logout
export const useLogoutClient = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: logoutClient,
    onSuccess: () => {
      // redirige après la déconnexion
      router.navigate({ to: '/' })
    },
  })
}
