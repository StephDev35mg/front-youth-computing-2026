import { createFileRoute } from '@tanstack/react-router'
import Welcome from '@/components/landingPage/Welcome'
import Functionality from '@/components/landingPage/functionality'
import Sponsor from '@/components/landingPage/Sponsor'
import Teams from '@/components/landingPage/Teams'
import Footer from '@/components/landingPage/Footer'
import Pricing from '@/components/landingPage/Pricing'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <main className='w-full overflow-x-hidden'>
      <Welcome />
      <Functionality />
      <Sponsor />
      <Pricing />
      <Teams />
      <Footer />
    </main>
  )
}
