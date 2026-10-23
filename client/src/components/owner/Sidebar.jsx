import React, { useState } from 'react'
import { dummyUserData, ownerMenuLinks, assets } from '../../assets/assets'
import { useLocation, NavLink } from 'react-router-dom'

const Sidebar = () => {
    const user = dummyUserData
    const location = useLocation()
    const [image, setImage] = useState('')

    const updateImage = () => {
        if (!image) return
        user.image = URL.createObjectURL(image)
        setImage('')
    }

    return (
        <aside className='w-64 min-h-full border-r border-gray-300 bg-white flex flex-col'>


            <div className='flex flex-col items-center pt-8 pb-6'>
                <div className='group relative'>
                    <label htmlFor="image" className='cursor-pointer'>
                        <img
                            src={
                                image
                                    ? URL.createObjectURL(image)
                                    : user?.image ||
                                      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300'
                            }
                            alt="Profile"
                            className='h-14 w-14 rounded-full object-cover'
                        />

                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            hidden
                            onChange={(e) => setImage(e.target.files[0])}
                        />

                        <div className='absolute inset-0 hidden rounded-full bg-black/10 group-hover:flex items-center justify-center'>
                            <img src={assets.edit_icon} alt="Edit" />
                        </div>
                    </label>
                </div>

                <p className='mt-2 text-base text-center'>
                    {user?.name || 'GreatStack'}
                </p>

                {image && (
                    <button
                        onClick={updateImage}
                        className='mt-2 flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1 text-primary'
                    >
                        Save
                        <img src={assets.check_icon} width={13} alt="" />
                    </button>
                )}
            </div>

 
            <nav className='w-full'>
                {ownerMenuLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={`relative flex items-center gap-3 w-full py-3 pl-4 pr-3 ${
                            link.path === location.pathname
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600'
                        }`}
                    >
                        <img
                            src={
                                link.path === location.pathname
                                    ? link.coloredIcon
                                    : link.icon
                            }
                            alt=""
                            className='w-5 h-5 object-contain'
                        />

                        <span className='text-sm'>
                            {link.name}
                        </span>

                        {link.path === location.pathname && (
                            <div className='absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-l bg-primary' />
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar