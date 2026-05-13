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
     alt: 'FullStack Developer',
     rules: 'FullStack Developer',
     clipId: 'clip-another1',
     type: 'image',
   },
   {
     src: '/assets/squad/Ariane.png',
     alt: 'Frontend Developer & Presenter',
     rules: 'Frontend Developer & Lead Presenter',
     clipId: 'clip-another2',
     type: 'image',
   },
   {
     src: '/assets/squad/Fanilo.png',
     alt: 'Backend Developer',
     rules: 'Backend Developer API',
     clipId: 'clip-another3',
     type: 'image',
   },
   {
     src: '/assets/squad/Faly.png',
     alt: 'Backend & DevOps Engineer',
     rules: 'Backend & DevOps Engineer',
     clipId: 'clip-another2',
     type: 'image',
   }
 ]

  const itemsToRender = mediaItems || defaultMediaItems

  return (
  
      

      <section
        ref={ref}
        className={`w-full grid grid-cols-1 gap-4 rounded-lg border p-4 dark:bg-black sm:grid-cols-2 sm:gap-6 sm:p-5 lg:grid-cols-4 lg:gap-8 ${className || ''}`}
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
              <span className='relative z-10 block text-center text-sm  font-bold text-white  px-2 py-1'>
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

  )
})

ImageSquadComponent.displayName = 'ImageSquadComponent'

export default ImageSquadComponent
