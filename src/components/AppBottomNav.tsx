import { useLocation, useRouter } from '@tanstack/react-router'
import { Bell, Home, Settings, Shield, Map } from 'lucide-react'

export default function AppSidebar() {
  const router = useRouter()
  const pathname = useLocation({ select: (location) => location.pathname })

  const tabs = [
    { title: 'Dashboard', icon: Home, to: '/dashboard' },
    { title: 'Carte', icon: Map, to: '/carte' },
    { title: 'Alertes', icon: Bell, to: '/alerts', badge: true },
    { title: 'Predictions', icon: Bell, to: '/predictions', badge: true },
    { title: 'zones', icon: Settings, to: '/zone' },
    { title: 'Profile', icon: Shield, to: '/profile' },
  ]

  return (
    <div className='fixed  left-0 top-0 h-full w-64 bg-white border-r shadow-sm flex flex-col p-4'>
      {/* Header */}
      <div className='mb-6 px-2'>
        <h1 className='text-lg font-bold'>Admin Panel</h1>
        <p className='text-xs text-gray-500'>Monitoring System</p>
      </div>

      {/* Nav */}
      <nav className='flex flex-col gap-2'>
        {tabs.map((item) => {
          const isActive = pathname === item.to
          const Icon = item.icon

          return (
            <button
              key={item.to}
              onClick={() => router.navigate({ to: item.to })}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}
              `}
            >
              <Icon size={18} />

              <span className='flex-1 text-left'>{item.title}</span>

              {item.badge && (
                <span className='w-2 h-2 bg-red-500 rounded-full' />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className='mt-auto text-xs text-gray-400 px-2'>
        v1.0 • Admin System
      </div>
    </div>
  )
}
