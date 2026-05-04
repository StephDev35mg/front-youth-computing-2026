import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { cn } from '@/lib/utils'

import { useSelector } from 'react-redux'
import type { RootState } from '#/redux/store'
import { useConfirmSignIn } from '@/api/auth/confirm.signin.api'
import { toast } from 'sonner'

export const Route = createFileRoute('/(auth)/confirmSignIn')({
  validateSearch: (search: Record<string, unknown>) => ({
    otpSent:
      search.otpSent === true ||
      search.otpSent === 'true' ||
      search.otpSent === 1 ||
      search.otpSent === '1',
  }),
  component: OtpVerification,
})

function OtpVerification() {
  const router = useRouter()
  const { otpSent } = Route.useSearch()

  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // ✅ 5 min
  const [isExpired, setIsExpired] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const email = useSelector((state: RootState) => state.client.user?.email)

  const { mutateAsync } = useConfirmSignIn()

  useEffect(() => {
    if (!otpSent) return

    toast.success('OTP envoyé')
    router.navigate({
      to: '/confirmSignIn',
      replace: true,
      search: (prev) => ({ ...prev, otpSent: undefined }),
    })
  }, [otpSent, router])

  // ✅ Timer propre (une seule instance)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer)
          setIsExpired(true)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleComplete = async (value: string) => {
    if (value.length !== 6 || isExpired || isSubmitting) return

    if (!email) {
      setError('Session invalide. Veuillez vous reconnecter.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await mutateAsync({
        email,
        otp: value,
      })
    } catch {
      setError('Code invalide ou expiré.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = () => {
    setTimeLeft(300)
    setIsExpired(false)
    setOtp('')
    setError(null)
  }

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center text-4xl'>Vérification</CardTitle>
          <CardDescription className='text-center'>
            Code envoyé à <br />
            <span className='font-medium'>{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='flex  justify-center'>
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={setOtp}
              onComplete={handleComplete}
              ref={inputRef}
            >
              <InputOTPGroup className='gap-2'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className={cn(
                      'h-12 w-10 border-2',
                      isExpired && 'border-red-400',
                    )}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Timer */}
          <div className='text-center'>
            {isExpired ? (
              <span className='text-red-500'>Code expiré</span>
            ) : (
              <span>{formatTime(timeLeft)}</span>
            )}
          </div>

          {/* Error */}
          {error && <p className='text-red-500 text-center'>{error}</p>}

          <Button
            onClick={() => handleComplete(otp)}
            disabled={otp.length !== 6 || isExpired || isSubmitting}
            className='w-full'
          >
            {isSubmitting ? 'Vérification...' : 'Valider'}
          </Button>

          <div className='text-center'>
            <Button variant='link' onClick={handleResend} disabled={!isExpired}>
              Renvoyer le code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OtpVerification
