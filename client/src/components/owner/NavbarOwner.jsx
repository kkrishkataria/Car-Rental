import React from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { UseAppContext } from '../../context/AppContext'

const NavbarOwner = () => {
    const { user, logout } = UseAppContext()
    const location = useLocation()
    const isActive = location.pathname === '/owner/manage-bookings'

    return (
        <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
            <Link to='/'>
                <img src={assets.logo} alt="" className='h-7' />
            </Link>

            <div className='flex items-center gap-6'>
                <Link
                    to='/owner/manage-bookings'
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                        isActive ? 'text-primary' : 'text-gray-600'
                    }`}
                >
                    My Bookings
                </Link>

                <p className='text-sm'>Welcome, {user?.name || "Owner"}</p>

                <button
                    onClick={logout}
                    className='px-3.5 py-1.5 text-xs bg-primary hover:bg-primary-dull text-white rounded-lg transition-all cursor-pointer font-medium'
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default NavbarOwner
