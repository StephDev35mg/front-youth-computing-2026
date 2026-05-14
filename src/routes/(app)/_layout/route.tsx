import { Outlet, createFileRoute } from '@tanstack/react-router'
import AuthProvider from '@/components/redirection/AuthProvider'
import AppSidebar from '@/components/AppBottomNav'

export const Route = createFileRoute('/(app)/_layout')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <AuthProvider>
      <div className='flex min-h-screen bg-gray-50'>
        {/* 🧭 SIDEBAR */}
        <AppSidebar />

        {/* 📄 MAIN CONTENT */}
        <main className='flex-1 ml-64 p-6'>
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}
