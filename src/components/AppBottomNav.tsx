'use client'

import { useLocation, useRouter } from '@tanstack/react-router'
import { Bell, Home, Settings, Shield } from 'lucide-react'

import ExpandedTabs from '@/components/ui/expanded-tabs'

export default function AppBottomNav() {
  const router = useRouter()
  const pathname = useLocation({ select: (location) => location.pathname })

  const tabs = [
    { title: 'Dashboard', icon: Home, to: '/dashboard' },
    { title: 'Settings', icon: Settings, to: '/settings' },
    { title: 'Security', icon: Shield, to: '/security' },
    { title: 'Notifications', icon: Bell, to: '/notifications', badge: true },
    {
      title: 'Profile',
      to: '/profile',
      imageUrl:
        'https://i.pinimg.com/736x/1f/d5/dc/1fd5dcd65af5ca8ef7b4211ce3631549.jpg',
    },
  ]

  const selectedIndex = tabs.findIndex((t) => 'to' in t && t.to === pathname)

  return (
    <div className='fixed inset-x-0 bottom-4 z-50 lg:p-4 flex justify-center'>
      <ExpandedTabs
        tabs={tabs}
        selectedIndex={selectedIndex >= 0 ? selectedIndex : null}
        onChange={(index) => {
          if (index == null) return
          const item = tabs[index]
          if (!item || !('to' in item)) return
          router.navigate({ to: item.to })
        }}
      />
    </div>
  )
}
