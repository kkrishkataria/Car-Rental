import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { UseAppContext } from '../../context/AppContext'
import { motion } from 'motion/react'

const NavbarOwner = () => {
    const { user, logout } = UseAppContext()

    return (
        <div className='flex items-center justify-between px-6 md:px-12 py-4 text-gray-600 border-b border-borderColor bg-white relative transition-all'>
            <Link to='/' className='flex items-center gap-2'>
                <img src={assets.logo} alt="Car Rental Logo" className='h-7' />
            </Link>

            <div className='flex items-center gap-5 sm:gap-7'>
                <Link
                    to='/'
                    className='text-sm font-medium text-gray-600 hover:text-primary transition-colors'
                >
                    Browse Cars
                </Link>

                <p className='text-sm font-medium text-gray-600 hidden sm:block'>
                    Welcome, <span className='text-gray-900 capitalize'>{user?.name || "Owner"}</span>
                </p>

                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={logout}
                    className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg font-medium text-sm shadow-xs hover:shadow-md"
                >
                    Logout
                </motion.button>
            </div>
        </div>
    )
}

export default NavbarOwner
