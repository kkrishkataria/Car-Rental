import React from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'

const CarCard = ({ car }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
                navigate(`/car-details/${car._id}`)
                scrollTo(0, 0)
            }}
            className='group rounded-xl overflow-hidden shadow-lg bg-white cursor-pointer transition-colors duration-300'
        >
            <div className='relative h-48 overflow-hidden'>
                <img
                    src={car.image}
                    alt="Car Image"
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />

                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'
                >
                    Available Now
                </motion.p>

                <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
                    <span className='font-semibold'>
                        {currency}{car.pricePerDay}
                    </span>
                    <span className='text-sm text-white/80'> / day</span>
                </div>
            </div>

            <div className='p-4 sm:p-5'>
                <div className='flex justify-between items-start mb-2'>
                    <div>
                        <h3 className='text-lg font-medium group-hover:text-primary transition-colors'>
                            {car.brand} {car.model}
                        </h3>

                        <p className='text-muted-foreground text-sm'>
                            {car.category} • {car.year}
                        </p>
                    </div>
                </div>

                <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
                    <div className='flex items-center text-sm text-muted-foreground'>
                        <img
                            src={assets.users_icon}
                            alt=""
                            className='h-4 mr-2'
                        />
                        <span>{car.seating_capacity} Seats</span>
                    </div>

                    <div className='flex items-center text-sm text-muted-foreground'>
                        <img
                            src={assets.fuel_icon}
                            alt=""
                            className='h-4 mr-2'
                        />
                        <span>{car.fuel_type}</span>
                    </div>

                    <div className='flex items-center text-sm text-muted-foreground'>
                        <img
                            src={assets.car_icon}
                            alt=""
                            className='h-4 mr-2'
                        />
                        <span>{car.transmission}</span>
                    </div>

                    <div className='flex items-center text-sm text-muted-foreground'>
                        <img
                            src={assets.location_icon}
                            alt=""
                            className='h-4 mr-2'
                        />
                        <span>{car.location}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CarCard