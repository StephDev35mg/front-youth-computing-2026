import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useRegisterAcount } from '@/api/auth/register.account.api'
import { toast } from 'sonner'
import Loading from '@/components/Loading'

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Au moins 3 caractères' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Lettres, chiffres, underscore uniquement',
    }),
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Au moins 6 caractères' }),
})

export const Route = createFileRoute('/(auth)/signUp')({
  component: SignUp,
})

function SignUp() {
  const { mutate, isPending, isSuccess, isError, error } = useRegisterAcount()
  const [showPassword, setShowPassword] = useState(false)
  const [strength, setStrength] = useState(0)
  const hasNotifiedRef = useRef({ success: false, error: false })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const passwordValue = watch('password') || ''

  // Mise à jour force en live
  useEffect(() => {
    let score = 0
    if (passwordValue.length >= 8) score++
    if (/[A-Z]/.test(passwordValue)) score++
    if (/[0-9]/.test(passwordValue)) score++
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++
    if (passwordValue.length >= 12) score++
    setStrength(Math.min(score, 4))
  }, [passwordValue])

  const strengthInfo = [
    { label: 'Très faible', color: 'bg-red-500', width: 'w-1/5' },
    { label: 'Faible', color: 'bg-orange-500', width: 'w-2/5' },
    { label: 'Moyen', color: 'bg-yellow-500', width: 'w-3/5' },
    { label: 'Bon', color: 'bg-blue-500', width: 'w-4/5' },
    { label: 'Excellent', color: 'bg-green-500', width: 'w-full' },
  ][strength]

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    hasNotifiedRef.current = { success: false, error: false }
    mutate(data)
  }

  useEffect(() => {
    if (isSuccess && !hasNotifiedRef.current.success) {
      hasNotifiedRef.current.success = true
      toast.success('Compte créé. Vérifiez votre email pour confirmer.')
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError && !hasNotifiedRef.current.error) {
      hasNotifiedRef.current.error = true
      toast.error(
        error instanceof Error ? error.message : "L'inscription a échoué.",
      )
    }
  }, [isError, error])

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4'>
        <div className='w-full max-w-md flex flex-col gap-4'>
        <CardHeader className='space-y-1 pb-2'>
          <CardTitle className='text-4xl text-center'>
            Create your Account
          </CardTitle>
          <CardDescription className='text-center'>
            Inscrivez-vous en quelques secondes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <FieldGroup>
              {/* Username */}
              <Field data-invalid={!!errors.username}>
                <FieldLabel>Nom d'utilisateur</FieldLabel>
                <Input
                  placeholder='entrez votre nom'
                  autoComplete='username'
                  autoFocus
                  {...register('username')}
                />
                {errors.username && <FieldError errors={[errors.username]} />}
              </Field>

              {/* Email */}
              <Field data-invalid={!!errors.email}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type='email'
                  placeholder='email@example.com'
                  autoComplete='email'
                  {...register('email')}
                />
                {errors.email && <FieldError errors={[errors.email]} />}
              </Field>

              {/* Password */}
              <Field data-invalid={!!errors.password}>
                <FieldLabel>Mot de passe</FieldLabel>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    autoComplete='new-password'
                    {...register('password')}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent'
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>

                {passwordValue && (
                  <div className='mt-2 space-y-1'>
                    <div className='h-1.5 bg-muted rounded-full overflow-hidden'>
                      <div
                        className={cn(
                          'h-full transition-all duration-300',
                          strengthInfo.color,
                          strengthInfo.width,
                        )}
                      />
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Force :{' '}
                      <span className='font-medium'>{strengthInfo.label}</span>
                    </p>
                  </div>
                )}

                {errors.password && <FieldError errors={[errors.password]} />}
              </Field>
            </FieldGroup>

            <Button
              type='submit'
              className='w-full'
              disabled={isSubmitting || isPending}
            >
              {isPending ? (
                <Loading size={15} color='primary' />
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className='flex justify-center text-sm text-muted-foreground'>
          Déjà inscrit ?{' '}
          <Button variant='link' className='ml-1 px-0'>
            <Link to='/signIn'>Se connecter</Link>
          </Button>
        </CardFooter>
      </div>
    </div>
  )
}
