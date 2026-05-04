import { motion } from 'framer-motion'
import TestimonialsColumn from '../FunctionnalityComponent'

const testimonials = [
  {
    text: 'This ERP revolutionized our operations...',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    name: 'Briana Patton',
    role: 'Operations Manager',
  },
  {
    text: 'Implementing this ERP was smooth...',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    name: 'Bilal Ahmed',
    role: 'IT Manager',
  },
  {
    text: 'The support team is exceptional...',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    name: 'Saman Malik',
    role: 'Customer Support Lead',
  },
  {
    text: 'This ERP seamless integration...',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    name: 'Omar Raza',
    role: 'CEO',
  },
  {
    text: 'Its robust features...',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    name: 'Zainab Hussain',
    role: 'Project Manager',
  },
  {
    text: 'The smooth implementation...',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
    name: 'Aliza Khan',
    role: 'Business Analyst',
  },
  {
    text: 'Our business functions improved...',
    image: 'https://randomuser.me/api/portraits/men/7.jpg',
    name: 'Farhan Siddiqui',
    role: 'Marketing Director',
  },
  {
    text: 'They delivered a solution...',
    image: 'https://randomuser.me/api/portraits/women/8.jpg',
    name: 'Sana Sheikh',
    role: 'Sales Manager',
  },
  {
    text: 'Using this ERP...',
    image: 'https://randomuser.me/api/portraits/men/9.jpg',
    name: 'Hassan Ali',
    role: 'E-commerce Manager',
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

const Testimonials = () => {
  return (
    <section className='relative bg-background py-16 sm:py-20'>
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* 🔹 HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='mx-auto flex max-w-[540px] flex-col items-center'
        >
          <div className='rounded-lg border px-4 py-1'>Functionnality</div>

          <h2 className='mt-5 text-center text-3xl font-bold sm:text-4xl'>
            What our users say
          </h2>

          <p className='mt-5 text-center opacity-75'>
            See what our customers have to say about us.
          </p>
        </motion.div>

        {/* 🔹 TESTIMONIALS + BLUR */}
        <div className='relative mt-10 flex max-h-[560px] justify-center gap-6 overflow-hidden sm:max-h-[740px]'>
          {/* 🔝 Blur TOP */}
          <div className='pointer-events-none absolute left-0 top-0 h-15 w-full blur-sm z-10' />

          {/* 🔽 Blur BOTTOM */}
          <div className='pointer-events-none absolute bottom-0 left-0 h-24 w-full blur-sm z-10' />

          {/* 🧱 CONTENT */}
          <div
            className='flex gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]'
          >
            <TestimonialsColumn testimonials={firstColumn} duration={15} />

            <TestimonialsColumn
              testimonials={secondColumn}
              className='hidden md:block'
              duration={19}
            />

            <TestimonialsColumn
              testimonials={thirdColumn}
              className='hidden lg:block'
              duration={17}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
