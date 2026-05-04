import ImageSquadComponent from '@/components/ImageSquadComponent'

export default function Teams() {
  return (
    <section className='bg-gray-50 py-16 sm:py-20 '>
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
        <div className='w-full max-w-4xl rounded-lg border  p-4 shadow-md dark:bg-black sm:p-6'>
          <h2 className='mb-6 text-center text-xl font-bold  sm:text-2xl'>
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
