import type { RootState } from '@/redux/store'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useEffect } from 'react'

export const Route = createFileRoute('/(app)/_layout/dashboard')({
  validateSearch: (search: Record<string, unknown>) => ({
    connected:
      search.connected === true ||
      search.connected === 'true' ||
      search.connected === 1 ||
      search.connected === '1',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { connected } = Route.useSearch()

  const user = useSelector((state: RootState) => state.client.user)


  useEffect(() => {
    if (!connected) return

    toast.success('Bien connecté')
    router.navigate({
      to: '/dashboard',
      replace: true,
      search: { connected: false },
    })
  }, [connected, router])

  
  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-semibold'>Dashboard</h1>
          <p className='text-sm text-muted-foreground'>
            Bienvenue{user?.username ? `, ${user.username}` : ''}.
          </p>
        </div>

        
      </div>

     
    </div>
  )
}
