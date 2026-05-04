import { Outlet, createRootRoute, useRouter } from '@tanstack/react-router'
import { Toaster } from 'src/components/ui/sonner'
import '../styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '#/redux/store'
import { useEffect } from 'react'
import { setNavigate } from '@/api/main.api'

const queryClient = new QueryClient()
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const router = useRouter()

  useEffect(() => {
    setNavigate((to: string) => {
      router.navigate({ to })
    })
  }, [router])

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Outlet />
        <Toaster />
      </Provider>
    </QueryClientProvider>
  )
}
