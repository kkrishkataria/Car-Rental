import React from 'react'
import { motion } from 'motion/react'
import Title from './Title.jsx'
import CarCard from './CarCard.jsx'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { UseAppContext } from '../context/AppContext.jsx'

const FeaturedSection = () => {
  const navigate = useNavigate()
  const { cars } = UseAppContext()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
      className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'
    >
      <div>
        <Title
          title='Featured Vehicles'
          subTitle='Explore our selection of premium vehicles available for your next adventure.'
        />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18 w-full'
      >
        {
          cars.slice(0, 6).map((car, index) => (
            <motion.div
              key={car._id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
              }}
            >
              <CarCard car={car} />
            </motion.div>
          ))
        }
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05, x: 4 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
        onClick={() => { navigate('/cars'); scrollTo(0, 0) }}
        className='flex items-center justify-center gap-2 px-6 py-2.5 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer shadow-xs transition-colors'
      >
        Explore all cars
        <img src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  )
}

export default FeaturedSection
