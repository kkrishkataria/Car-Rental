import React from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'

const Banner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden shadow-lg'
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className='text-white'
      >
        <h2 className='text-3xl font-medium'>Do You Own a Luxury Car?</h2>

        <p className='mt-2'>
          Monetize your vehicle effortlessly by listing it on CarRental.
        </p>

        <p className='max-w-130'>
          We take care of insurance, driver verification and secure payments — so you can earn passive income, stress-free.
        </p>

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className='px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-sm mt-4 cursor-pointer font-medium shadow-sm'
        >
          List your car
        </motion.button>
      </motion.div>

      <motion.img
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
        src={assets.banner_car_image}
        alt="car"
        className='max-h-45 mt-10'
      />
    </motion.div>
  )
}

export default Banner
