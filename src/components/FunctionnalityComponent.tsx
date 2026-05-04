import React from 'react'
import { motion } from 'framer-motion'

type Testimonial = {
  text: string
  image: string
  name: string
  role: string
}

const TestimonialsColumn = ({
  testimonials,
  className,
  duration = 10,
}: {
  testimonials: Testimonial[]
  className?: string
  duration?: number
}) => {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        className='flex flex-col gap-6 pb-6'
      >
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            {testimonials.map((item, index) => (
              <div
                key={index}
                className='p-6 rounded-3xl border shadow-lg max-w-lg'
              >
                <p>{item.text}</p>

                <div className='flex items-center gap-3 mt-5'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='h-10 w-10 rounded-full'
                  />
                  <div>
                    <div className='font-medium'>{item.name}</div>
                    <div className='text-sm opacity-60'>{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}

export default TestimonialsColumn
