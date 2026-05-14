import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '../ui/button'

export default function Welcome() {
  const shouldReduceMotion = useReducedMotion()

  const ImagesUrls = [
    'https://i.pinimg.com/1200x/7e/30/37/7e30373954a3f077e946c966dcf0e2c6.jpg',
    'https://i.pinimg.com/1200x/52/de/d1/52ded15a548efce2be380f102701707a.jpg',
    'https://i.pinimg.com/736x/60/4a/97/604a9746527776fa9a3f42dde3b3fdbd.jpg',
    'https://i.pinimg.com/1200x/06/08/d9/0608d9bdc84bbc10ee8451d6650c0e30.jpg',
    'https://i.pinimg.com/736x/b9/da/84/b9da84fb61ccc5beac7bcc081ab0b357.jpg',
    'https://i.pinimg.com/1200x/31/95/ae/3195ae2ed0aac79dc3800b41cfaa2f82.jpg',
    'https://i.pinimg.com/736x/c3/44/7f/c3447f6bf16456e878d781f67e6e9c0b.jpg',
    'https://i.pinimg.com/736x/40/ad/b1/40adb1cf07ca4e3bf99542e031901138.jpg',
    'https://i.pinimg.com/736x/25/e7/a0/25e7a020fadd2704e1815e8aa0b60800.jpg',
    'https://i.pinimg.com/736x/84/cd/15/84cd15a4c4b14bdc8cbf235fc39babb2.jpg',
    'https://i.pinimg.com/736x/c8/45/4c/c8454cf5e4f3e3bece408a594d13d2d4.jpg',
    'https://i.pinimg.com/736x/7a/fb/59/7afb59d8f1f47eeb2ee8a4e7ced669b7.jpg',
  ]

  const tiles = [
    'col-start-1 col-span-4 row-start-1 row-span-3',
    'col-start-5 col-span-4 row-start-1 row-span-4',
    'col-start-9 col-span-2 row-start-1 row-span-2',
    'col-start-11 col-span-2 row-start-1 row-span-2',
    'col-start-9 col-span-2 row-start-3 row-span-1',
    'col-start-11 col-span-2 row-start-3 row-span-1',
    'col-start-1 col-span-4 row-start-4 row-span-2',
    'col-start-1 col-span-2 row-start-6 row-span-1',
    'col-start-3 col-span-2 row-start-6 row-span-1',
    'col-start-5 col-span-2 row-start-5 row-span-2',
    'col-start-7 col-span-2 row-start-5 row-span-2',
    'col-start-9 col-span-4 row-start-4 row-span-3',
  ]

  return (
    <section className='relative min-h-screen overflow-hidden'>
      {/* BACKGROUND */}
      <div className='absolute inset-0'>
        <div className='absolute left-1/2 top-1/2 h-[1000px] w-[1600px] sm:h-[1300px] sm:w-[1800px] -translate-x-1/2 -translate-y-1/2 -rotate-12 scale-110'>
          <div className='grid h-full w-full grid-cols-12 grid-rows-6 gap-3 opacity-95 sm:gap-6'>
            {ImagesUrls.map((src, i) => (
              <div
                key={src}
                className={[
                  'relative overflow-hidden rounded-3xl shadow-[0_30px_80px_-50px_rgba(0,0,0,0.55)] ring-1 ring-black/10 transform-gpu',
                  tiles[i] ?? 'col-span-4 row-span-3',
                ].join(' ')}
              >
                <img
                  src={src}
                  loading='lazy'
                  decoding='async'
                  className='h-full w-full object-cover transform-gpu'
                />
              </div>
            ))}
          </div>
        </div>

        <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05),rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.55)_100%)]' />
      </div>

      {/* LOGO */}
      <div className='absolute z-30 left-1/2 top-10 -translate-x-1/2'>
        <div className='flex items-center lg:gap-6 gap-10 bg-white/10 backdrop-blur-md lg:px-6 px-4 lg:py-4 py-2 rounded-full shadow-md'>
          <span className='lg:text-2xl text-lg text-[#D4BBFF] font-semibold tracking-tight'>
            Smart<span className='text-[#FFDE8B]'>Fianara</span>
          </span>

          <div className='relative'>
            <select
              name='language'
              id='language'
              className='appearance-none bg-white/10 text-white pl-8 pr-6 py-1 rounded-full border border-white/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40'
            >
              <option value='fr'>french</option>
              <option value='en'>english</option>
            </select>

            <img
              src='https://flagcdn.com/16x12/us.png'
              className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-3 pointer-events-none'
            />
            <img
              src='https://flagcdn.com/16x12/fr.png'
              className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-3 pointer-events-none'
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className='relative z-10 flex h-screen items-center justify-center px-4 sm:px-6'>
        <div className='w-full max-w-lg'>
          {/* CARD */}
          <div className='relative rounded-[28px] bg-background px-6 py-8 sm:px-8 sm:py-10 shadow-2xl shadow-black/20 ring-1 ring-black/5 overflow-hidden'>
            <img
              src='/assets/forme3.png'
              className='absolute bottom-0 left-0 w-40 md:w-64 lg:w-60 -translate-x-1/4 translate-y-1/4 rotate-90 pointer-events-none select-none z-0'
            />

            <div className='relative z-10'>
              <h1 className='text-center text-4xl font-semibold leading-[1.05] tracking-tight text-black sm:text-5xl'>
               
                <span className='text-primary'>Ville connectée</span>
              </h1>

              <p className='mt-4 text-pretty text-center text-base text-black/65 sm:text-lg'>
                Signalez les coupures d’eau et d’électricité en temps réel.
                <br />
                Aidez votre ville à mieux anticiper les problèmes.
              </p>
            </div>
          </div>

          {/* DOWNLOAD */}
          <div className='mt-5 rounded-[28px] bg-black/85 px-5 py-5 sm:px-7 sm:py-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur'>
            <div className='text-white text-center'>
              <p className='text-lg font-semibold'>Télécharger l’application</p>
              <p className='mt-1 text-sm text-white/60'>
                Disponible sur Android et iPhone
              </p>
            </div>

            <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center'>
              {/* ANDROID */}
              <a
                href='#'
              >
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
                  className='h-15 w-full'
                />
              </a>

              {/* IOS */}
              <a
                href='#'
              >
                <img
                  src='https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg'
                  className='h-15 w-full'
                />
              </a>
            </div>

            {/* <div className='mt-4 flex flex-col gap-2 sm:flex-row'>
              <Button variant={'link'} className='flex-1'>
                <Link
                  to='/signIn'
                  className='flex h-14 flex-1 bg-white items-center justify-center rounded-full px-6 text-base font-medium text-black'
                >
                  Se connecter
                </Link>
              </Button>

              <Button variant={'link'} className='flex-1'>
                <Link
                  to='/signUp'
                  className='flex h-14 flex-1 items-center justify-center bg-[#D4BBFF] rounded-full px-6 text-base font-medium text-white'
                >
                  S’inscrire
                </Link>
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}
