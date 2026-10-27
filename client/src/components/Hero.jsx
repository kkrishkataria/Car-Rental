import React, { useState } from 'react'
import { motion } from 'motion/react'
import { assets, cityList } from '../assets/assets'
import { UseAppContext } from '../context/AppContext'

const Hero = () => {
    const [pickupLocation, setPickupLocation] = useState('')
    const {navigate,pickupDate,setPickupDate,returnDate,setReturnDate}=UseAppContext()
    const handleSearch=(e)=>{
        e.preventDefault()
        navigate('/cars?pickupLocation='+pickupLocation+'&pickupDate='+pickupDate+'&returnDate='+returnDate)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'
        >
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className='text-4xl md:text-5xl font-semibold'
            >
                Luxury cars on Rent
            </motion.h1>

            <motion.form
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSearch}
                className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'
            >
                <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className='flex flex-col items-start gap-2'
                    >
                        <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
                            <option value="">Pickup Location</option>
                            {cityList.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>

                        <p className='px-1 text-sm text-gray-500'>
                            {pickupLocation ? pickupLocation : 'Please select location'}
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className='flex flex-col items-start gap-2'
                    >
                        <label htmlFor='pickup-date'>Pick-up Date</label>
                        <input
                            value={pickupDate}
                            onChange={(e)=>setPickupDate(e.target.value)}
                            type="date"
                            id="pickup-date"
                            min={new Date().toISOString().split('T')[0]}
                            className='text-sm text-gray-500'
                            required
                        />
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className='flex flex-col items-start gap-2'
                    >
                        <label htmlFor='return-date'>Return Date</label>
                        <input
                            value={returnDate}
                            onChange={(e)=>setReturnDate(e.target.value)}
                            type="date"
                            id="return-date"
                            min={new Date().toISOString().split('T')[0]}
                            className='text-sm text-gray-500'
                            required
                        />
                    </motion.div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer'
                >
                    <img
                        src={assets.search_icon}
                        alt="search"
                        className='brightness-300'
                    />
                    Search
                </motion.button>
            </motion.form>

            <motion.img
                initial={{ opacity: 0, y: 50, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                src={assets.main_car}
                alt="car"
                className='max-h-74'
            />
        </motion.div>
    )
}

export default Hero
