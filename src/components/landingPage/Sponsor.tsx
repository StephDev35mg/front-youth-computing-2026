export default function Sponsor() {
  return (
    <section className='flex flex-col items-center justify-center gap-6 py-16 sm:py-20'>
      <h1 className='text-center text-3xl font-semibold sm:text-4xl'>
        Organized By
      </h1>
      <AnimatedLogoCloud />
    </section>
  )
}

const logos = [
  {
    name: 'AKATANA Goavana',
    url: '/assets/Akatana.png',
  },
  {
    name: 'Kay Fm',
    url: '/assets/Kay_fm.png',
  },
  {
    name: 'MNDPT Direction',
    url: '/assets/MNDPT.png',
  },
  {
    name: 'NDAO HIFANOSIKA',
    url: '/assets/Ndao_hifanosika.png',
  },
  {
    name: 'Youth Computing',
    url: '/assets/Youth_computing.png',
  },
  {
    name: 'Yas',
    url: '/assets/Yas.png',
  },
  {
    name: 'UN IT',
    url: '/assets/UN_IT.png',
  },
  {
    name: 'Radio Rofia',
    url: '/assets/Radio_rofia.png',
  },
  {
    name: 'Yantsou computer',
    url: '/assets/Yantsou_computer.png',
  },
]

const AnimatedLogoCloud = () => {
  return (
    <div className='w-full py-10'>
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div
          className='relative mt-6 flex gap-6 overflow-hidden p-2'
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className='flex shrink-0 animate-logo-cloud gap-2 lg:gap-20'
            >
              {logos.map((logo) => (
                <img
                  key={logo.name}
                  src={logo.url}
                  alt={logo.name}
                  className='h-18 w-32 object-contain px-2 sm:h-20 sm:w-32'
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
