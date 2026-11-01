import { useEffect, useState, useRef } from 'react'
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

    // Sorting state
    const [sortBy, setSortBy] = useState('default')
    const [showSortMenu, setShowSortMenu] = useState(false)
    const sortMenuRef = useRef(null)

    // Close sort menu on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
                setShowSortMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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

    // Enhanced search filtering across make, model, features, category, fuel, location, seats, year, etc.
    const searchedCars = !query
        ? availableCars
        : availableCars.filter((car) => {
            const fullName = `${car.brand || ''} ${car.model || ''}`.toLowerCase()
            const brand = (car.brand || '').toLowerCase()
            const model = (car.model || '').toLowerCase()
            const category = (car.category || '').toLowerCase()
            const transmission = (car.transmission || '').toLowerCase()
            const fuel = (car.fuel_type || '').toLowerCase()
            const location = (car.location || '').toLowerCase()
            const yearStr = (car.year || '').toString()
            const seatsStr = (car.seating_capacity || '').toString()
            const description = (car.description || '').toLowerCase()

            return (
                fullName.includes(query) ||
                brand.includes(query) ||
                model.includes(query) ||
                category.includes(query) ||
                transmission.includes(query) ||
                fuel.includes(query) ||
                location.includes(query) ||
                yearStr.includes(query) ||
                seatsStr === query ||
                `${seatsStr} seat`.includes(query) ||
                `${seatsStr} seats`.includes(query) ||
                `${seatsStr} seater`.includes(query) ||
                description.includes(query)
            )
        })

    // Sort cars by selected criteria (Dates/Year, Models/Make, Seats, Price)
    const displayedCars = [...searchedCars].sort((a, b) => {
        if (sortBy === 'model-asc') {
            const nameA = `${a.brand || ''} ${a.model || ''}`.toLowerCase()
            const nameB = `${b.brand || ''} ${b.model || ''}`.toLowerCase()
            return nameA.localeCompare(nameB)
        }
        if (sortBy === 'model-desc') {
            const nameA = `${a.brand || ''} ${a.model || ''}`.toLowerCase()
            const nameB = `${b.brand || ''} ${b.model || ''}`.toLowerCase()
            return nameB.localeCompare(nameA)
        }
        if (sortBy === 'year-desc') {
            return (b.year || 0) - (a.year || 0)
        }
        if (sortBy === 'year-asc') {
            return (a.year || 0) - (b.year || 0)
        }
        if (sortBy === 'date-span') {
            const dateA = a.availableFrom ? new Date(a.availableFrom).getTime() : Infinity
            const dateB = b.availableFrom ? new Date(b.availableFrom).getTime() : Infinity
            return dateA - dateB
        }
        if (sortBy === 'seats-desc') {
            return (b.seating_capacity || 0) - (a.seating_capacity || 0)
        }
        if (sortBy === 'seats-asc') {
            return (a.seating_capacity || 0) - (b.seating_capacity || 0)
        }
        if (sortBy === 'price-asc') {
            return (a.pricePerDay || 0) - (b.pricePerDay || 0)
        }
        if (sortBy === 'price-desc') {
            return (b.pricePerDay || 0) - (a.pricePerDay || 0)
        }
        return 0
    })

    const sortOptions = [
        { label: 'Default Order', value: 'default', group: 'General' },
        { label: 'Model: A to Z', value: 'model-asc', group: 'Model & Make' },
        { label: 'Model: Z to A', value: 'model-desc', group: 'Model & Make' },
        { label: 'Year: Newest to Oldest', value: 'year-desc', group: 'Dates & Year' },
        { label: 'Year: Oldest to Newest', value: 'year-asc', group: 'Dates & Year' },
        { label: 'Available Dates: Earliest First', value: 'date-span', group: 'Dates & Year' },
        { label: 'Seats: Most to Least', value: 'seats-desc', group: 'Seating Capacity' },
        { label: 'Seats: Least to Most', value: 'seats-asc', group: 'Seating Capacity' },
        { label: 'Price: Low to High', value: 'price-asc', group: 'Pricing' },
        { label: 'Price: High to Low', value: 'price-desc', group: 'Pricing' },
    ]

    const getActiveSortLabel = () => {
        const active = sortOptions.find(o => o.value === sortBy)
        return active && active.value !== 'default' ? active.label : 'Sort Cars'
    }

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
                className='flex flex-col items-center py-16 bg-light max-md:px-4'
            >
                <Title
                    title='Available Cars'
                    subtitle='Browse our selection of premium vehicles available for your next adventure'
                />

                {/* Search Bar + Sort Button Container */}
                <div className='relative max-w-160 w-full mt-6' ref={sortMenuRef}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className='flex items-center bg-white px-4 h-13 rounded-full shadow-md border border-gray-100 transition-all focus-within:shadow-lg focus-within:border-primary/50'
                    >
                        <img
                            src={assets.search_icon}
                            alt="Search"
                            className='w-4.5 h-4.5 mr-2 opacity-60'
                        />

                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder='Search by make, model, seats, location, or features...'
                            className='w-full h-full outline-none text-gray-700 text-sm placeholder:text-gray-400 bg-transparent'
                        />

                        {input && (
                            <button
                                onClick={() => setInput('')}
                                className='text-gray-400 hover:text-gray-600 px-2 text-sm font-semibold cursor-pointer'
                                title="Clear search"
                            >
                                ✕
                            </button>
                        )}

                        <div className='h-6 w-px bg-gray-200 mx-2' />

                        <button
                            type="button"
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className={`flex items-center gap-1.5 p-2 rounded-full cursor-pointer transition-all ${
                                sortBy !== 'default'
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-gray-500 hover:text-primary hover:bg-gray-100'
                            }`}
                            title="Sort by dates, models, seats, or price"
                        >
                            <img
                                src={assets.filter_icon}
                                alt="Sort"
                                className='w-4 h-4 opacity-80'
                            />
                            <span className='text-xs font-medium hidden sm:inline whitespace-nowrap'>
                                {sortBy !== 'default' ? 'Sorted' : 'Sort'}
                            </span>
                        </button>
                    </motion.div>

                    {/* Sort Dropdown Popup */}
                    <AnimatePresence>
                        {showSortMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className='absolute right-0 top-16 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-3 overflow-hidden'
                            >
                                <div className='flex items-center justify-between pb-2 mb-2 border-b border-gray-100 px-2'>
                                    <span className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                                        Sort Options
                                    </span>
                                    {sortBy !== 'default' && (
                                        <button
                                            onClick={() => setSortBy('default')}
                                            className='text-xs text-primary hover:underline cursor-pointer'
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>

                                <div className='max-h-72 overflow-y-auto flex flex-col gap-1 pr-1 text-sm'>
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                setSortBy(opt.value)
                                                setShowSortMenu(false)
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                                sortBy === opt.value
                                                    ? 'bg-primary text-white shadow-xs'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>{opt.label}</span>
                                            {sortBy === opt.value && <span>✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Quick Sort / Filter Chips */}
                <div className='flex flex-wrap items-center justify-center gap-2 mt-4 max-w-2xl px-4'>
                    <button
                        onClick={() => setSortBy('default')}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                            sortBy === 'default'
                                ? 'bg-gray-900 text-white shadow-xs'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setSortBy(sortBy === 'model-asc' ? 'model-desc' : 'model-asc')}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                            sortBy.startsWith('model')
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        Model {sortBy === 'model-asc' ? 'A→Z' : sortBy === 'model-desc' ? 'Z→A' : '(A-Z)'}
                    </button>
                    <button
                        onClick={() => setSortBy(sortBy === 'year-desc' ? 'year-asc' : 'year-desc')}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                            sortBy.startsWith('year')
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        Year {sortBy === 'year-desc' ? '(Newest)' : sortBy === 'year-asc' ? '(Oldest)' : ''}
                    </button>
                    <button
                        onClick={() => setSortBy(sortBy === 'seats-desc' ? 'seats-asc' : 'seats-desc')}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                            sortBy.startsWith('seats')
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        Seats {sortBy === 'seats-desc' ? '(High→Low)' : sortBy === 'seats-asc' ? '(Low→High)' : ''}
                    </button>
                    <button
                        onClick={() => setSortBy(sortBy === 'price-asc' ? 'price-desc' : 'price-asc')}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                            sortBy.startsWith('price')
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        Price {sortBy === 'price-asc' ? '↑' : sortBy === 'price-desc' ? '↓' : ''}
                    </button>
                </div>
            </motion.div>

            {/* Results Display */}
            <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-8 mb-20'>
                <div className='flex items-center justify-between xl:px-20 max-w-7xl mx-auto'>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='text-gray-500 font-medium text-sm'
                    >
                        Showing {displayedCars.length} {displayedCars.length === 1 ? 'Car' : 'Cars'}
                        {input.trim() && <span> for "<span className='text-gray-800 font-semibold'>{input}</span>"</span>}
                    </motion.p>

                    {sortBy !== 'default' && (
                        <span className='text-xs text-primary font-medium bg-primary/10 px-2.5 py-1 rounded-full'>
                            Sorted by: {getActiveSortLabel()}
                        </span>
                    )}
                </div>

                {displayedCars.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-center py-20 text-gray-500'
                    >
                        <p className='text-lg font-medium'>No cars found</p>
                        <p className='text-sm mt-1 text-gray-400'>
                            {input.trim()
                                ? `No cars match "${input}". Try searching by another brand, model, seat count, or location.`
                                : 'No cars available under the selected criteria.'}
                        </p>
                        <button
                            onClick={() => { setInput(''); setSortBy('default'); }}
                            className='mt-4 px-4 py-2 bg-primary text-white text-xs font-medium rounded-lg cursor-pointer hover:bg-primary-dull'
                        >
                            Reset Search & Filters
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 xl:px-20 max-w-7xl mx-auto'
                    >
                        <AnimatePresence>
                            {displayedCars.map((car, index) => (
                                <motion.div
                                    layout
                                    key={car._id || car.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.35, delay: index * 0.03 }}
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
