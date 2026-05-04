'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      icons={{
        success: <CircleCheckIcon className='size-6 text-white' />,
        info: <InfoIcon className='size-6 text-white' />,
        warning: <TriangleAlertIcon className='size-6 text-white' />,
        error: <OctagonXIcon className='size-6 text-white' />,
        loading: <Loader2Icon className='size-6 animate-spin text-white' />,
      }}
      position='top-center'
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'group toast text-white shadow-lg border-none',
          success: '!bg-green-500 text-white border-none',
          error: '!bg-red-500 text-white border-none',
          warning: '!bg-yellow-500 text-white border-none',
          info: '!bg-blue-500 text-white border-none',
          title: '!text-white font-medium ml-1',
          description: '!text-white/90',
          loader: '!text-white',
          closeButton:
            '!absolute right-3 top-3 rounded-md p-1 text-white opacity-90 transition-opacity hover:opacity-100 hover:bg-white/20 group-hover:opacity-100',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
