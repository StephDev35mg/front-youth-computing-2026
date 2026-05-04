import { Outlet, createFileRoute } from '@tanstack/react-router'
import AuthProvider from '@/components/redirection/AuthProvider'
import AppBottomNav from '@/components/AppBottomNav'

export const Route = createFileRoute('/(app)/_layout')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <AuthProvider>
      <div className='min-h-screen pb-28'>
        <main className='mx-auto w-full max-w-5xl px-4 sm:px-6 py-6'>
          <Outlet />
        </main>
        <AppBottomNav />
      </div>
    </AuthProvider>
  )
}
