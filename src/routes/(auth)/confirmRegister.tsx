import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MailCheck } from 'lucide-react'

export const Route = createFileRoute('/(auth)/confirmRegister')({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === 'string' ? search.email : undefined,
  }),
  component: ConfirmRegister,
})

function ConfirmRegister() {
  const { email } = Route.useSearch()

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-2'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
            <MailCheck className='h-6 w-6 text-foreground' />
          </div>
          <CardTitle className='text-center text-3xl'>
            Vérifiez votre email
          </CardTitle>
          <CardDescription className='text-center'>
            {email ? (
              <>
                Un lien de confirmation a été envoyé à{' '}
                <span className='font-medium text-foreground'>{email}</span>.
              </>
            ) : (
              "Un lien de confirmation vient d'être envoyé à votre adresse email."
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='space-y-2 text-sm text-muted-foreground'>
            <p>Ouvrez le message et cliquez sur le lien pour activer votre compte.</p>
            <ul className='list-disc space-y-1 pl-5'>
              <li>Vérifiez aussi vos spams / promotions.</li>
              <li>Si vous ne recevez rien, patientez 1–2 minutes.</li>
            </ul>
          </div>

          <div className='flex flex-col gap-2'>
            <Button className='w-full'>
              <Link to='/signIn'>Aller à la connexion</Link>
            </Button>
            <Button variant='outline' className='w-full'>
              <Link to='/signUp'>Changer d’email</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
