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
import Loading from '@/components/Loading'
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
import { useEffect, useState } from 'react'
import { useSignInClient } from '@/api/auth/signin.client.api'
import { toast } from 'sonner'

const formSchema = z.object({
  email: z.string().email({ message: 'Adresse email required' }),
  password: z.string().min(1, { message: 'mots de passe required' }),
})

export const Route = createFileRoute('/(auth)/signIn')({
  component: SignIn,
})

function SignIn() {
  const {
    mutate: signInClient,
    isPending,
    isError: signInIsError,
  } = useSignInClient()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    signInClient(data)
  }
  useEffect(() => {
    if (signInIsError) {
      toast.error('Password or Email invalid')
    }
  }, [signInIsError])

  return (
    <div className='min-h-screen w-full flex items-center justify-center from-background to-muted/30 p-4'>
      <div className='w-full max-w-md flex flex-col gap-4'>
        <CardHeader className='space-y-1 pb-2'>
          <CardTitle className='text-4xl text-center'>Welcome Back</CardTitle>
          <CardDescription className='text-center'>
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
            <FieldGroup>
              {/* Email */}
              <Field data-invalid={!!errors.email}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type='email'
                  placeholder='exemple@email.com'
                  autoComplete='email'
                  autoFocus
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
                    autoComplete='current-password'
                    {...register('password')}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent'
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                {errors.password && <FieldError errors={[errors.password]} />}
              </Field>
            </FieldGroup>

            <div className='flex justify-end'>
              <Button variant='link' size='sm' className='px-0'>
                <Link to='/'>Mot de passe oublié ?</Link>
              </Button>
            </div>

            <Button variant={'default'} type='submit' className='w-full'>
              {isPending ? (
                <Loading size={15} color='primary' />
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className='flex justify-center text-sm text-muted-foreground'>
          Pas de compte ?{' '}
          <Button variant='link' className='ml-1 px-0'>
            <Link to='/signUp'>Créer un compte</Link>
          </Button>
        </CardFooter>
      </div>
    </div>
  )
}
