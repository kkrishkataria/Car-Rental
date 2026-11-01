import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { UseAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AddCar = () => {
    const { axios, currency } = UseAppContext()
    const navigate = useNavigate()

    const [image, setImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')

    const [car, setCar] = useState({
        brand: '',
        model: '',
        year: '',
        pricePerDay: '',
        category: '',
        transmission: '',
        fuel_type: '',
        seating_capacity: '',
        location: '',
        description: '',
        availableFrom: '',
        availableTo: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!image) {
            setPreviewUrl('')
            return
        }
        const url = URL.createObjectURL(image)
        setPreviewUrl(url)
        return () => {
            URL.revokeObjectURL(url)
        }
    }, [image])

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if (isLoading) return
        if (!image) {
            toast.error('Please upload a car image')
            return
        }
        if (car.availableFrom && car.availableTo && new Date(car.availableTo) < new Date(car.availableFrom)) {
            toast.error('Available Until date must be on or after Available From date')
            return
        }
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('image', image)
            formData.append('carData', JSON.stringify(car))
            const { data } = await axios.post('/api/owner/add-car', formData)
            if (data.success) {
                toast.success(data.message)
                navigate('/owner/manage-cars')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='px-4 py-10 md:px-10 flex-1'>
            <h1 className='text-2xl font-semibold'>Add New Car</h1>

            <p className='text-gray-500 mt-2'>
                Fill in details to list a new car for booking, including pricing,
                availability, and car specifications.
            </p>

            <form
                onSubmit={onSubmitHandler}
                className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'
            >
                <div className='flex flex-col gap-2'>
                    <label htmlFor='car-image' className='flex items-center gap-3 cursor-pointer'>
                        <img
                            src={previewUrl || assets.upload_icon}
                            alt=''
                            className='h-16 w-28 object-contain rounded-md border border-dashed border-gray-300 p-1'
                        />
                        <span>{image ? image.name : 'Upload a picture of your car *'}</span>
                    </label>

                    <input
                        type='file'
                        id='car-image'
                        accept='image/*'
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <div className='flex flex-col gap-1'>
                        <label>Brand</label>
                        <input
                            type='text'
                            placeholder='e.g. BMW, Mercedes, Audi...'
                            required
                            className='px-3 py-2 border border-borderColor rounded-md outline-none'
                            value={car.brand}
                            onChange={(e) =>
                                setCar({ ...car, brand: e.target.value })
                            }
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label>Model</label>
                        <input
                            type='text'
                            placeholder='e.g. X5, E-Class, M4...'
                            required
                            className='px-3 py-2 border border-borderColor rounded-md outline-none'
                            value={car.model}
                            onChange={(e) =>
                                setCar({ ...car, model: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
                    <div className='flex flex-col gap-1'>
                        <label>Year</label>
                        <input
                            type='number'
                            placeholder='2024'
                            required
                            min={1990}
                            max={new Date().getFullYear() + 1}
                            className='px-3 py-2 border border-borderColor rounded-md outline-none'
                            value={car.year}
                            onChange={(e) =>
                                setCar({ ...car, year: e.target.value })
                            }
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label>Daily Price ({currency})</label>
                        <input
                            type='number'
                            placeholder='100'
                            required
                            min={1}
                            max={100000}
                            className='px-3 py-2 border border-borderColor rounded-md outline-none'
                            value={car.pricePerDay}
                            onChange={(e) =>
                                setCar({ ...car, pricePerDay: e.target.value })
                            }
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label>Category</label>
                        <select
                            required
                            className='px-3 py-2 border border-borderColor rounded-md outline-none'
                            value={car.category}
                            onChange={(e) =>
                                setCar({ ...car, category: e.target.value })
                            }
                        >
                            <option value=''>Select a category</option>
                            <option value='SUV'>SUV</option>
                            <option value='Sedan'>Sedan</option>
                            <option value='Hatchback'>Hatchback</option>
                            <option value='Van'>Van</option>
                            <option value='Coupe'>Coupe</option>
                        </select>
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
                    <div className='flex flex-col gap-1'>
                        <label>Transmission</label>
                        <select
                            required
                            className='px-3 py-2 border border-borderColor rounded-md outline-none'
                            value={car.transmission}
                            onChange={(e) =>
                                setCar({ ...car, transmission: e.target.value })
                            }
                        >
                            <option value=''>Select a transmission</option>
                            <option value='Automatic'>Automatic</option>
                            <option value='Manual'>Manual</option>
                            <option value='Semi-Automatic'>Semi-Automatic</option>
                        </select>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label>Fuel Type</label>
                        <select
                            required
                            className='px-3 py-2 border border-borderColor rounded-md outline-none'
                            value={car.fuel_type}
                            onChange={(e) =>
                                setCar({ ...car, fuel_type: e.target.value })
                            }
                        >
                            <option value=''>Select a fuel type</option>
                            <option value='Petrol'>Petrol</option>
                            <option value='Diesel'>Diesel</option>
                            <option value='Electric'>Electric</option>
                            <option value='Hybrid'>Hybrid</option>
                        </select>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label>Seating Capacity</label>
                        <input
                            type='number'
                            placeholder='5'
                            min={1}
                            max={20}
                            required
                            className='px-3 py-2 border border-borderColor rounded-md outline-none'
                            value={car.seating_capacity}
                            onChange={(e) =>
                                setCar({
                                    ...car,
                                    seating_capacity: e.target.value
                                })
                            }
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <label>Location</label>
                    <select
                        required
                        className='px-3 py-2 border border-borderColor rounded-md outline-none'
                        value={car.location}
                        onChange={(e) =>
                            setCar({ ...car, location: e.target.value })
                        }
                    >
                        <option value=''>Select a location</option>
                        <option value='New York'>New York</option>
                        <option value='Los Angeles'>Los Angeles</option>
                        <option value='Houston'>Houston</option>
                        <option value='Chicago'>Chicago</option>
                    </select>
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='font-medium text-gray-700'>Availability Window (Span of Days)</label>
                    <p className='text-xs text-gray-400'>Specify the date span when this car is available for booking (leave blank if always available).</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-1'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs text-gray-500'>Available From</label>
                            <input
                                type='date'
                                min={new Date().toISOString().split('T')[0]}
                                className='px-3 py-2 border border-borderColor rounded-md outline-none bg-white'
                                value={car.availableFrom}
                                onChange={(e) =>
                                    setCar({ ...car, availableFrom: e.target.value })
                                }
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs text-gray-500'>Available Until</label>
                            <input
                                type='date'
                                min={car.availableFrom || new Date().toISOString().split('T')[0]}
                                className='px-3 py-2 border border-borderColor rounded-md outline-none bg-white'
                                value={car.availableTo}
                                onChange={(e) =>
                                    setCar({ ...car, availableTo: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <label>Description</label>
                    <textarea
                        rows={4}
                        placeholder='e.g. A luxurious SUV with a spacious interior and a powerful engine.'
                        required
                        className='px-3 py-2 border border-borderColor rounded-md outline-none resize-none'
                        value={car.description}
                        onChange={(e) =>
                            setCar({ ...car, description: e.target.value })
                        }
                    />
                </div>

                <button
                    type='submit'
                    disabled={isLoading}
                    className='flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dull text-white rounded-md w-fit cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    <img src={assets.tick_icon} alt='' className='w-4' />
                    {isLoading ? 'Listing...' : 'List Your Car'}
                </button>
            </form>
        </div>
    )
}

export default AddCar
