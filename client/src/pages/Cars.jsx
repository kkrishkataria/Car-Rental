import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { UseAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const Cars = () => {

    const [searchParams] = useSearchParams()
    const searchParam = searchParams.get('search')
    const [input, setInput] = useState(searchParam || '')
    const pickupLocation = searchParams.get('pickupLocation')
    const pickupDate = searchParams.get('pickupDate')
    const returnDate = searchParams.get('returnDate')
    const { cars, axios, fetchCars } = UseAppContext()
    const isSearchData = pickupDate && pickupLocation && returnDate
    const [filteredCars, setFilteredCars] = useState([])

    useEffect(() => {
        const queryFromUrl = searchParams.get('search')
        if (queryFromUrl !== null) {
            setInput(queryFromUrl)
        } else {
            setInput('')
        }
    }, [searchParams])

    useEffect(() => {
        if (fetchCars) fetchCars()
        // Re-fetch every time this page is visited so booked cars are excluded
    }, [fetchCars])

    useEffect(() => {
        if (!isSearchData) return undefined

        let cancelled = false

        axios.post('/api/bookings/check-availablity', {
            location: pickupLocation,
            pickupDate,
            returnDate,
        })
            .then(({ data }) => {
                if (cancelled) return

                if (data.success) {
                    setFilteredCars(data.availableCars)
                    if (data.availableCars.length === 0) toast('No cars available')
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
    }, [axios, isSearchData, pickupLocation, pickupDate, returnDate])

    const availableCars = isSearchData ? filteredCars : cars
    const query = input.trim().toLowerCase()
    const displayedCars = !query
        ? availableCars
        : availableCars.filter((car) => {
            const carName = `${car.brand} ${car.model}`.toLowerCase()
            return (
                carName.includes(query) ||
                car.brand?.toLowerCase().includes(query) ||
                car.model?.toLowerCase().includes(query) ||
                car.category?.toLowerCase().includes(query) ||
                car.transmission?.toLowerCase().includes(query)
            )
        })

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className='flex flex-col items-center py-20 bg-light max-md:px-4'
            >
                <Title
                    title='Available Cars'
                    subtitle='Browse our selection of premium vehicles available for your next adventure'
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    whileHover={{ scale: 1.01 }}
                    className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow-md border border-gray-100 transition-all'
                >
                    <img
                        src={assets.search_icon}
                        alt=""
                        className='w-4.5 h-4.5 mr-2 opacity-70'
                    />

                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder='Search by make, model, or features'
                        className='w-full h-full outline-none text-gray-600 placeholder:text-gray-400'
                    />

                    <img
                        src={assets.filter_icon}
                        alt=""
                        className='w-4.5 h-4.5 ml-2 opacity-70'
                    />
                </motion.div>
            </motion.div>

            <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className='text-gray-500 xl:px-20 max-w-7xl mx-auto font-medium'
                >
                    Showing {displayedCars.length} Cars
                </motion.p>

                {displayedCars.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-center py-20 text-gray-500'
                    >
                        <p className='text-lg font-medium'>No cars found</p>
                        <p className='text-sm mt-1 text-gray-400'>
                            {input.trim() ? `No car found matching "${input}".` : 'Try adjusting your search terms or filters.'}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'
                    >
                        <AnimatePresence>
                            {displayedCars.map((car, index) => (
                                <motion.div
                                    layout
                                    key={car._id || car.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <CarCard car={car} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

export default Cars
