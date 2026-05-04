import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_layout/settings')({
  component: Settings,
})

function Settings() {
  return (
    <div>
      <h1 className='text-3xl font-semibold'>Settings</h1>
      <p className='mt-2 text-sm text-muted-foreground'>
        Page en cours de construction.
      </p>
    </div>
  )
}
