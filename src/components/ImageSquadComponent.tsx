import React from 'react'

interface MediaItem {
  src: string
  type: 'image' | 'video'
  alt: string
  rules: string
  clipId: 'clip-another1' | 'clip-another2' | 'clip-another3'
}

interface ImageSquadComponentProps
  extends React.ComponentPropsWithoutRef<'section'> {
  mediaItems?: MediaItem[]
}

const ImageSquadComponent = React.forwardRef<
  HTMLElement,
  ImageSquadComponentProps
>(({ mediaItems, className, ...props }, ref) => {
  const defaultMediaItems: MediaItem[] = [
    {
      src: '/assets/squad/Steph.png',
      alt: 'Full Stack Developper',
      rules: 'Full Stack Developper',
      clipId: 'clip-another1',
      type: 'image',
    },
    {
      src: 'https://images.unsplash.com/photo-1573165850883-9b0e18c44bd2?w=500&auto=format&fit=crop',
      alt: 'Front End and UI/UX Designer',
      rules: 'Front End and UI/UX Designer',
      clipId: 'clip-another2',
      type: 'image',
    },
    {
      src: 'https://images.unsplash.com/photo-1573496358322-6d530124361d?w=500&auto=format&fit=crop',
      alt: 'Backend Developer',
      rules: 'Backend Developer and DevOps',
      clipId: 'clip-another3',
      type: 'image',
    },
  ]

  const itemsToRender = mediaItems || defaultMediaItems

  return (
    <>
      <svg className='clipppy absolute -left-[999px] -top-[999px] h-0 w-0'>
        <defs>
          <clipPath id='clip-another1' clipPathUnits={'objectBoundingBox'}>
            <path
              d='M0 0.0417599C0 0.0186966 0.0250721 0 0.056 0H0.6105C0.641428 0 0.6665 0.0186965 0.6665 0.0417599V0.148024C0.6665 0.171087 0.691572 0.189784 0.7225 0.189784H0.944C0.974928 0.189784 1 0.20848 1 0.231544V0.95824C1 0.981303 0.974928 1 0.944 1H0.056C0.0250721 1 0 0.981303 0 0.95824V0.0417599Z'
              fill='#D9D9D9'
            />
          </clipPath>
          <clipPath id='clip-another2' clipPathUnits={'objectBoundingBox'}>
            <path
              d='M0.1145 0.139138L0.235656 0.0147291C0.244771 0.0053695 0.257945 0 0.271794 0H0.5H0.96C0.982091 0 1 0.016076 1 0.0359066V0.964093C1 0.983924 0.982091 1 0.96 1H0.04C0.0179086 1 0 0.983924 0 0.964093V0.5V0.265845C0 0.255659 0.00428628 0.24585 0.0120005 0.238381L0.1145 0.139138Z'
              fill='#D9D9D9'
            />
          </clipPath>
          <clipPath id='clip-another3' clipPathUnits={'objectBoundingBox'}>
            <path
              d='M0 0.0351351C0 0.0157306 0.0174609 0 0.039 0H0.5H0.727414C0.741798 0 0.755513 0.00547207 0.765179 0.0150678L0.858 0.107207L0.98622 0.236143C0.995093 0.245066 1 0.256625 1 0.268605V0.5V0.964865C1 0.984269 0.982539 1 0.961 1H0.039C0.0174609 1 0 0.984269 0 0.964865V0.0351351Z'
              fill='#D9D9D9'
            />
          </clipPath>
        </defs>
      </svg>

      <section
        ref={ref}
        className={`w-full grid grid-cols-1 gap-4 rounded-lg border bg-white p-4 dark:bg-black sm:grid-cols-2 sm:gap-6 sm:p-5 lg:grid-cols-3 lg:gap-8 ${className || ''}`}
        {...props}
      >
        {itemsToRender.map((item, index) => (
          <figure
            key={index}
            className='overflow-hidden relative'
            style={{ clipPath: `url(#${item.clipId})` }}
          >
            <div className='absolute bottom-2 right-0 left-0 h-10 max-w-[160px] mx-auto'>
              {/* Fond flou */}
              <div className='absolute inset-0 blur-sm bg-black/50 rounded-lg'></div>

              {/* Texte net */}
              <span className='relative z-10 block text-center font-bold text-white text-xs px-2 py-1'>
                {item.rules}
              </span>
            </div>
            {item.type === 'image' ? (
              <img
                src={item.src}
                alt={item.alt}
                className='aspect-[4/5] min-h-full w-full align-bottom object-cover transition-all duration-300 hover:scale-105'
              />
            ) : (
              <video
                autoPlay
                muted
                loop
                className='aspect-[4/5] min-h-full w-full align-bottom object-cover transition-all duration-300 hover:scale-105'
              >
                <source src={item.src} type='video/mp4' />
              </video>
            )}
          </figure>
        ))}
      </section>
    </>
  )
})

ImageSquadComponent.displayName = 'ImageSquadComponent'

export default ImageSquadComponent
