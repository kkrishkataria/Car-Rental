import { useState, useEffect } from 'react'
import { assets, menuLinks } from '../assets/assets.js'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UseAppContext } from '../context/AppContext.jsx'
import { motion } from 'motion/react'

const Navbar = () => {
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()
    const { setShowLogin, user, logout, isOwner } = UseAppContext()

    useEffect(() => {
        if (location.pathname === '/cars') {
            const params = new URLSearchParams(location.search)
            const q = params.get('search')
            setSearchQuery(q || '')
        }
    }, [location.pathname, location.search])

    const handleSearchChange = (e) => {
        const val = e.target.value
        setSearchQuery(val)
        if (val.trim()) {
            navigate(`/cars?search=${encodeURIComponent(val)}`, {
                replace: location.pathname === '/cars',
            })
        } else if (location.pathname === '/cars') {
            navigate('/cars', { replace: true })
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/cars?search=${encodeURIComponent(searchQuery.trim())}`, {
                replace: location.pathname === '/cars',
            })
        } else {
            navigate('/cars', { replace: true })
        }
        setOpen(false)
    }

    return (
        <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all z-40 ${
                location.pathname === "/" && "bg-light"
            }`}
        >
            <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
            >
                <Link to='/'>
                    <img src={assets.logo} alt='logo' className='h-8' />
                </Link>
            </motion.div>

            <div
                className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-6 transition-all duration-300 z-50 ${
                    location.pathname === '/' ? "bg-light" : "bg-white"
                } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
            >
                {menuLinks.map((link, index) => {
                    const path = link.name === 'My Bookings' && isOwner
                        ? '/owner/manage-bookings'
                        : link.path
                    return (
                        <motion.div
                            key={index}
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Link
                                to={path}
                                onClick={() => setOpen(false)}
                                className={`transition-colors hover:text-primary ${
                                    location.pathname === path ? 'text-primary font-medium' : ''
                                }`}
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    )
                })}

                {/* Search products form to search car name */}
                <motion.form
                    onSubmit={handleSearchSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileFocusWithin={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className='flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full w-48 sm:w-56 bg-white transition-all focus-within:border-primary focus-within:shadow-md'
                >
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-gray-700"
                        placeholder="Search products"
                    />
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer"
                        aria-label="Search"
                    >
                        <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-70 hover:opacity-100" />
                    </motion.button>
                </motion.form>

                <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
                    {isOwner && (
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="cursor-pointer text-gray-700 hover:text-primary transition-colors font-medium"
                            onClick={() => {
                                setOpen(false)
                                navigate('/owner')
                            }}
                        >
                            Dashboard
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        onClick={() => {
                            setOpen(false)
                            user ? logout() : setShowLogin(true)
                        }}
                        className="cursor-pointer px-7 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg font-medium shadow-xs"
                    >
                        {user ? 'Logout' : 'Login'}
                    </motion.button>
                </div>
            </div>

            <motion.button
                whileTap={{ scale: 0.9 }}
                className='sm:hidden cursor-pointer'
                aria-label="Menu"
                onClick={() => setOpen(!open)}
            >
                <img
                    src={open ? assets.close_icon : assets.menu_icon}
                    alt="menu"
                />
            </motion.button>
        </motion.div>
    )
}

export default Navbar
