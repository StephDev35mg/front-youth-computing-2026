import { createFileRoute } from '@tanstack/react-router'
import Welcome from '@/components/landingPage/Welcome'
import Functionality from '@/components/landingPage/functionality'
import Sponsor from '@/components/landingPage/Sponsor'
import Teams from '@/components/landingPage/Teams'
import Footer from '@/components/landingPage/Footer'
import Pricing from '@/components/landingPage/Pricing'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
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
      <DotLottieReact
        src='https://lottie.host/a22979ec-7626-4a13-9ad9-705ee249be14/O4ptf0McXA.lottie'
        loop
        autoplay
        className='fixed bottom-4 right-10 w-42 h-42 pointer-events-none select-none'
      />
    </main>
  )
}
