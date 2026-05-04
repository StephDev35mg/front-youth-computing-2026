import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_layout/notifications')({
  component: Notifications,
})

function Notifications() {
  return (
    <div>
      <h1 className='text-3xl font-semibold'>Notifications</h1>
      <p className='mt-2 text-sm text-muted-foreground'>
        Page en cours de construction.
      </p>
    </div>
  )
}
