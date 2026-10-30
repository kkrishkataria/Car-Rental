
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { UseAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const CarDetails = () => {
    const { id } = useParams()
    const {
        currency,
        navigate,
        axios,
        user,
        isOwner,
        fetchCars,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
    } = UseAppContext()

    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCarById = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get(`/api/owner/cars/${id}`)
                if (data.success) {
                    setCar(data.car)
                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCarById()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            toast.error('Please log in to book a car')
            return
        }

        try {
            const { data } = await axios.post('/api/bookings/create', {
                car: id,
                pickupDate,
                returnDate,
            })

            if (data.success) {
                toast.success(data.message)
                if (fetchCars) fetchCars()   // refresh cars so booked car is removed from listings
                navigate('/my-bookings')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    if (loading) return <Loader />

    return car ? (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'
        >
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(-1)}
                className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'
            >
                <img
                    src={assets.arrow_icon}
                    alt=""
                    className='rotate-180 opacity-65'
                />
                Back to all cars
            </motion.button>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='lg:col-span-2'
                >
                    <motion.img
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'
                    />

                    <div className='space-y-6'>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-800'>
                                {car.brand} {car.model}
                            </h1>

                            <p className='text-gray-500 text-lg'>
                                {car.category} • {car.year}
                            </p>
                        </div>

                        <hr className='border-borderColor my-6' />

                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                            {[
                                {
                                    icon: assets.users_icon,
                                    text: `${car.seating_capacity} Seats`
                                },
                                {
                                    icon: assets.fuel_icon,
                                    text: car.fuel_type
                                },
                                {
                                    icon: assets.car_icon,
                                    text: car.transmission
                                },
                                {
                                    icon: assets.location_icon,
                                    text: car.location
                                }
                            ].map(({ icon, text }) => (
                                <motion.div
                                    key={text}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    transition={{ duration: 0.2 }}
                                    className='flex flex-col items-center bg-light p-4 rounded-lg cursor-default border border-transparent hover:border-gray-200'
                                >
                                    <img
                                        src={icon}
                                        alt=""
                                        className='h-5 mb-2'
                                    />
                                    <span className='font-medium text-gray-700'>{text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div>
                            <h2 className='text-xl font-medium mb-3 text-gray-800'>
                                Description
                            </h2>

                            <p className='text-gray-500 leading-relaxed'>
                                {car.description}
                            </p>
                        </div>

                        <div>
                            <h2 className='text-xl font-medium mb-3 text-gray-800'>
                                Features
                            </h2>

                            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                {[
                                    "360 Camera",
                                    "Bluetooth",
                                    "GPS",
                                    "Heated Seats",
                                    "Rear View Mirror"
                                ].map(item => (
                                    <motion.li
                                        key={item}
                                        whileHover={{ x: 4 }}
                                        transition={{ duration: 0.2 }}
                                        className='flex items-center text-gray-600'
                                    >
                                        <img
                                            src={assets.check_icon}
                                            className='h-4 mr-2'
                                            alt=""
                                        />
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {isOwner ? (
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-4 bg-white border border-gray-100'
                    >
                        <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
                            {currency}{car.pricePerDay}
                            <span className='text-base text-gray-400 font-normal'>per day</span>
                        </p>
                        <hr className='border-borderColor' />
                        <div className='flex flex-col items-center gap-3 py-6 text-center'>
                            <div className='w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='w-7 h-7 text-blue-400' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className='text-lg font-semibold text-gray-700'>Owner Account</p>
                            <p className='text-sm text-gray-400'>Owners cannot book cars. Switch to a customer account to make a booking.</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/owner/dashboard')}
                            className='w-full border border-primary text-primary hover:bg-primary hover:text-white transition-all py-3 font-medium rounded-xl cursor-pointer'
                        >
                            Go to Dashboard
                        </motion.button>
                    </motion.div>
                ) : car.isAvailable ? (
                    <motion.form
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500 bg-white border border-gray-100'
                    >
                        <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
                            {currency}{car.pricePerDay}

                            <span className='text-base text-gray-400 font-normal'>
                                per day
                            </span>
                        </p>

                        <hr className='border-borderColor my-6' />

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="pickup-date" className='font-medium text-gray-700'>
                                Pickup Date
                            </label>

                            <input
                                type="date"
                                id="pickup-date"
                                name="pickupDate"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                className='border border-borderColor px-3 py-2 rounded-lg text-gray-600 focus:outline-primary'
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="return-date" className='font-medium text-gray-700'>
                                Return Date
                            </label>

                            <input
                                type="date"
                                id="return-date"
                                name="returnDate"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                className='border border-borderColor px-3 py-2 rounded-lg text-gray-600 focus:outline-primary'
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            type="submit"
                            className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer shadow-md'
                        >
                            Book Now
                        </motion.button>

                        <p className='text-center text-sm text-gray-400'>
                            No credit card required to reserve
                        </p>
                    </motion.form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-4 bg-white border border-red-100'
                    >
                        <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
                            {currency}{car.pricePerDay}
                            <span className='text-base text-gray-400 font-normal'>per day</span>
                        </p>
                        <hr className='border-borderColor' />
                        <div className='flex flex-col items-center gap-3 py-6 text-center'>
                            <div className='w-14 h-14 rounded-full bg-red-50 flex items-center justify-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='w-7 h-7 text-red-400' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <p className='text-lg font-semibold text-gray-700'>Currently Unavailable</p>
                            <p className='text-sm text-gray-400'>This car has been booked by another customer. Please check back later or browse other available cars.</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/cars')}
                            className='w-full border border-primary text-primary hover:bg-primary hover:text-white transition-all py-3 font-medium rounded-xl cursor-pointer'
                        >
                            Browse Other Cars
                        </motion.button>
                    </motion.div>
                )}
            </div>

        </motion.div>
    ) : (
        <Loader />
    )
}

export default CarDetails
