import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/verifyEmail')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/verifyEmail"!</div>
}
