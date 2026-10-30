import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { assets } from '../assets/assets.js'
import Title from '../components/Title'
import { UseAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const [bookings,setBookings]=useState([])
  const { axios, currency, isOwner } = UseAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOwner) {
      navigate('/owner/manage-bookings', { replace: true })
    }
  }, [isOwner, navigate])

  useEffect(()=>{
    if (isOwner) return

    let cancelled = false

    axios.get('/api/bookings/user')
      .then(({ data }) => {
        if (cancelled) return
        if (data.success) {
          setBookings(data.bookings)
        } else {
          toast.error(data.message)
        }
      })
      .catch((error) => {
        if (!cancelled) toast.error(error.message)
      })

    return () => {
      cancelled = true
    }
  },[axios, isOwner])

  if (isOwner) return null

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'
    >
        <Title
            title='My Bookings'
            subTitle='View and manage your all car bookings'
            align='left'
        />

        <div className='mt-8'>
            {bookings.length === 0 ? (
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='mt-12 text-gray-500'
                >
                    You have no bookings yet.
                </motion.p>
            ) : (
                <AnimatePresence>
                    {bookings.map((booking, index) => (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                            whileHover={{ y: -4, boxShadow: '0 12px 28px -5px rgba(0, 0, 0, 0.08)' }}
                            className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-xl mt-5 first:mt-8 bg-white transition-shadow duration-300'
                        >
                            <div className='md:col-span-1'>
                                <div className='rounded-lg overflow-hidden mb-3 aspect-video bg-gray-50'>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        src={booking.car.image}
                                        alt=""
                                        className='w-full h-full object-cover'
                                    />
                                </div>

                                <p className='text-lg font-medium mt-2 text-gray-800'>
                                    {booking.car.brand} {booking.car.model}
                                </p>

                                <p className='text-gray-500 text-xs mt-0.5'>
                                    {booking.car.year} • {booking.car.category} • {booking.car.location}
                                </p>
                            </div>

                            <div className='md:col-span-2 flex flex-col justify-between'>
                                <div className='flex items-center gap-2'>
                                    <p className='px-3 py-1.5 bg-light rounded-md text-xs font-medium text-gray-600'>
                                        Booking #{index + 1}
                                    </p>

                                    <motion.p
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
                                            booking.status === 'confirmed'
                                                ? 'bg-green-400/15 text-green-600'
                                                : 'bg-red-400/15 text-red-600'
                                        }`}
                                    >
                                        {booking.status}
                                    </motion.p>
                                </div>

                                <div className='space-y-2 mt-4'>
                                    <div className='flex items-start gap-2.5'>
                                        <img
                                            src={assets.calendar_icon_colored}
                                            alt=""
                                            className='w-4 h-4 mt-0.5'
                                        />

                                        <div>
                                            <p className='text-gray-400 text-xs'>Rental Period</p>
                                            <p className='font-medium text-gray-700'>
                                                {booking.pickupDate.split('T')[0]} To{' '}
                                                {booking.returnDate.split('T')[0]}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex items-start gap-2.5'>
                                        <img
                                            src={assets.calendar_icon_colored}
                                            alt=""
                                            className='w-4 h-4 mt-0.5'
                                        />

                                        <div>
                                            <p className='text-gray-400 text-xs'>Pick-up Location</p>
                                            <p className='font-medium text-gray-700'>{booking.car.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-1 flex flex-col justify-between gap-6 md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-gray-100'>
                                <div className='text-sm text-gray-500'>
                                    <p className='text-xs uppercase tracking-wider text-gray-400'>Total Price</p>
                                    <h1 className='text-2xl font-bold text-primary mt-1'>
                                        {currency}{booking.price}
                                    </h1>
                                    <p className='text-xs text-gray-400 mt-2'>
                                        Booked on {booking.createdAt.split('T')[0]}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>
    </motion.div>
  )
}

export default MyBookings
