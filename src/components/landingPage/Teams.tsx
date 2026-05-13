import ImageSquadComponent from '@/components/ImageSquadComponent'

export default function Teams() {
  return (
    <section className='bg-gray-50 py-16 sm:py-20 '>
      <div className='mx-auto w-full  px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
        <div className='w-full  rounded-lg border  p-4 shadow-md sm:p-6'>
          <h2 className='mb-6 text-center text-4xl font-light text-foreground mb-6 sm:text-5xl lg:text-6xl'>
            Notre équipe
          </h2>

          <div className='mb-8'>
            <ImageSquadComponent />
          </div>
        </div>
      </div>
    </section>
  )
}
