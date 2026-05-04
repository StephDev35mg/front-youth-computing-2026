import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'
import isAcessToken from '@/hooks/isAccessToken'
import type { RootState } from '@/redux/store'
import Loading from '../Loading'
import { refreshSession } from '@/api/auth/refresh.session.api'
import { setAuth, logout } from '@/redux/slices/client.slice'

interface Props {
  children: React.ReactNode
}

const MIN_LOADER_MS = 400

const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const token = useSelector((state: RootState) => state.client.token?.access)

  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      const start = Date.now()

      try {
        //  1. Si access token valide → accès direct
        if (token && isAcessToken(token)) {
          if (!mounted) return
          setAllowed(true)
          return
        }

        //  2. Sinon → refresh via cookie HttpOnly
        const data = await refreshSession()

        if (!mounted) return

        dispatch(setAuth({ access: data.access, user: data.user }))
        setAllowed(true)
      } catch (error) {
        if (!mounted) return

        //  Refresh échoué → logout
        dispatch(logout())
        setAllowed(false)

        router.navigate({ to: '/signIn', replace: true })
      } finally {
        //  loader minimum UX
        const elapsed = Date.now() - start
        const wait = Math.max(0, MIN_LOADER_MS - elapsed)

        if (wait > 0) {
          await new Promise((resolve) => setTimeout(resolve, wait))
        }

        if (!mounted) return
        setChecking(false)
      }
    }

    initAuth()

    return () => {
      mounted = false
    }
  }, []) //  IMPORTANT : PAS de dépendance

  //  Loader pendant vérification auth
  if (checking) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loading color='secondary' size={40} />
      </div>
    )
  }

  // Non autorisé → rien (redirigé déjà)
  if (!allowed) return null

  // Autorisé
  return <>{children}</>
}

export default AuthProvider
