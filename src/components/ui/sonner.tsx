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
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme === 'dark' ? 'dark' : 'light'}
      position='top-center'
      icons={{
        success: <CircleCheckIcon className='size-4' />,
        info: <InfoIcon className='size-4' />,
        warning: <TriangleAlertIcon className='size-4' />,
        error: <OctagonXIcon className='size-4' />,
        loading: <Loader2Icon className='size-4 animate-spin' />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        className:
          'border ' +
          'data-[type=success]:!bg-[var(--success)] data-[type=success]:!text-white ' +
          'data-[type=error]:!bg-[var(--destructive)] data-[type=error]:!text-white ' +
          'data-[type=warning]:!bg-[var(--warning)] data-[type=warning]:!text-white ' +
          'data-[type=info]:!bg-[var(--info)] data-[type=info]:!text-white',
      }}
      {...props}
    />
  )
}

export { Toaster }
