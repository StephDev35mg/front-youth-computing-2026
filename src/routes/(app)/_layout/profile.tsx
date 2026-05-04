import { useEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { LogOutIcon, Pencil, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { RootState } from '@/redux/store'
import { logout } from '@/redux/slices/client.slice'
import { useLogoutClient } from '@/api/auth/logout.client.api'
import { useDeleteAccount } from '@/api/auth/delete.account.api'

export const Route = createFileRoute('/(app)/_layout/profile')({
  component: Profile,
})

const DEFAULT_AVATAR_URL =
  'https://i.pinimg.com/736x/1f/d5/dc/1fd5dcd65af5ca8ef7b4211ce3631549.jpg'

function Profile() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.client.user)

  const {
    mutate: logoutMutation,
    isSuccess: isLogoutSuccess,
    isPending: isLoggingOut,
  } = useLogoutClient()

  const { mutateAsync: deleteAccount, isPending: isDeleting } =
    useDeleteAccount()

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const [defaultAvatarBroken, setDefaultAvatarBroken] = useState(false)
  const [usernameValue, setUsernameValue] = useState(user?.username ?? '')
  const [emailValue, setEmailValue] = useState(user?.email ?? '')

  const avatarPreviewUrl = useMemo(() => {
    if (!avatarFile) return null
    return URL.createObjectURL(avatarFile)
  }, [avatarFile])

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)
    }
  }, [avatarPreviewUrl])

  useEffect(() => {
    if (!isLogoutSuccess) return
    dispatch(logout())
    toast.success('Déconnexion réussie')
  }, [isLogoutSuccess, dispatch])

  useEffect(() => {
    setUsernameValue(user?.username ?? '')
    setEmailValue(user?.email ?? '')
  }, [user?.username, user?.email])

  const handleLogout = () => {
    logoutMutation()
    setLogoutDialogOpen(false)
  }

  const handleDelete = async () => {
    if (!password) {
      toast.error('Mot de passe requis')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    const ok = window.confirm(
      'Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.',
    )
    if (!ok) return

    try {
      await deleteAccount({ password })
      dispatch(logout())
      toast.success('Compte supprimé')
      router.navigate({ to: '/', replace: true })
    } catch {
      toast.error('Suppression échouée')
    }
  }

  return (
    <div className='mx-auto w-full max-w-5xl space-y-6 px-4 pb-10 sm:px-6'>
      {/* HEADER */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold sm:text-3xl'>Profil</h1>
          <p className='text-sm text-muted-foreground'>Gérez votre compte</p>
        </div>

        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogTrigger>
            <Button
              variant='outline'
              className='border-destructive hover:bg-destructive/10 hover:text-destructive text-destructive'
              disabled={isLoggingOut}
            >
              <LogOutIcon size={24} className='mr-1' />
              {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la déconnexion</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir vous déconnecter ?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setLogoutDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button variant='destructive' onClick={handleLogout}>
                Confirmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className='border-b'>
          <CardTitle>Mon profil</CardTitle>
          <CardDescription>Informations principales</CardDescription>
        </CardHeader>

        <CardContent className='grid gap-8 md:grid-cols-2 items-center'>
          {/* AVATAR (50%) */}
          <div className='flex flex-col items-center justify-center gap-4'>
            <div className='relative'>
              <div className='w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 overflow-hidden rounded-full border bg-muted shadow-md'>
                {avatarPreviewUrl ? (
                  <img
                    src={avatarPreviewUrl}
                    className='h-full w-full object-cover'
                  />
                ) : defaultAvatarBroken ? (
                  <div className='grid h-full w-full place-items-center text-muted-foreground'>
                    <UserRound className='size-12' />
                  </div>
                ) : (
                  <img
                    src={DEFAULT_AVATAR_URL}
                    className='h-full w-full object-cover'
                    onError={() => setDefaultAvatarBroken(true)}
                  />
                )}
              </div>

              {/* bouton edit */}
              <Button
                type='button'
                size='icon'
                className='absolute bottom-3 right-3 rounded-full shadow-lg'
                onClick={() => avatarInputRef.current?.click()}
              >
                <Pencil className='size-4' />
              </Button>

              <input
                ref={avatarInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              />
            </div>

          </div>

          {/* FORM (50%) */}
          <div className='flex flex-col justify-center gap-6 w-full max-w-md mx-auto'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Nom d’utilisateur</label>
              <Input
                value={usernameValue}
                onChange={(e) => setUsernameValue(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Email</label>
              <Input
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
            </div>

            <Button className='w-full mt-2'>Sauvegarder</Button>
          </div>
        </CardContent>
      </Card>

      {/* DELETE ACCOUNT */}
      <Card>
        <CardHeader className='border-b'>
          <CardTitle className='text-destructive'>
            Supprimer le compte
          </CardTitle>
          <CardDescription>Cette action est irréversible</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4 md:space-y-5'>
          <Input
            type='password'
            placeholder='Mot de passe'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type='password'
            placeholder='Confirmer le mot de passe'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </CardContent>
        <CardFooter className='border-t flex justify-end'>
          <Button
            variant='destructive'
            className='w-full sm:w-auto px-8 justify-end'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer mon compte'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
