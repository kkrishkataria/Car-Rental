import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { UseAppContext } from '../../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const ManageCars = () => {
    const { isOwner, axios, currency } = UseAppContext()
    const navigate = useNavigate()
    const [cars, setCars] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchOwnerCars = async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get('/api/owner/cars')
            if (data.success) {
                setCars(data.cars)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleAvailability = async (carId) => {
        try {
            const { data } = await axios.post('/api/owner/toggle-car', { carId })
            if (data.success) {
                toast.success(data.message)
                fetchOwnerCars()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteCar = async (carId) => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this car? Associated bookings will also be removed.')
            if (!confirm) return
            const { data } = await axios.post('/api/owner/delete-car', { carId })
            if (data.success) {
                toast.success(data.message)
                fetchOwnerCars()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (isOwner) fetchOwnerCars()
    }, [isOwner])

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>
            <Title
                title="Manage Cars"
                subTitle="View all listed cars, update their details, or remove them from the booking platform."
            />

            {isLoading ? (
                <div className="py-16 text-center text-sm text-gray-400">Loading your cars...</div>
            ) : cars.length === 0 ? (
                <div className="mt-10 text-center py-16 border border-dashed border-borderColor rounded-lg max-w-3xl">
                    <p className="text-gray-500 font-medium">No cars listed yet</p>
                    <p className="text-gray-400 text-sm mt-1">Add your first car to start receiving bookings.</p>
                    <button
                        onClick={() => navigate('/owner/add-car')}
                        className="mt-4 px-5 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-dull transition-all cursor-pointer"
                    >
                        + Add Car
                    </button>
                </div>
            ) : (
                <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
                    <table className='w-full border-collapse text-left text-sm text-gray-600'>
                        <thead className='text-gray-500'>
                            <tr>
                                <th className='p-3 font-medium'>Car</th>
                                <th className='p-3 font-medium max-md:hidden'>Category</th>
                                <th className='p-3 font-medium'>Price</th>
                                <th className='p-3 font-medium max-md:hidden'>Status</th>
                                <th className='p-3 font-medium'>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cars.map((car) => (
                                <tr key={car._id} className='border-t border-borderColor'>
                                    <td className='p-3 flex items-center gap-3'>
                                        <img
                                            src={car.image}
                                            alt=""
                                            className='h-12 w-12 aspect-square rounded-md object-cover'
                                        />
                                        <div className='max-md:hidden'>
                                            <p className='font-medium text-gray-700'>{car.brand} {car.model}</p>
                                        </div>
                                    </td>

                                    <td className='p-3 max-md:hidden'>
                                        {car.category}
                                    </td>

                                    <td className='p-3'>
                                        {currency}{car.pricePerDay}/day
                                    </td>

                                    <td className='p-3 max-md:hidden'>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                car.isAvailable
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-red-100 text-red-500'
                                            }`}
                                        >
                                            {car.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>

                                    <td className='p-3'>
                                        <div className='flex items-center gap-3'>
                                            <button
                                                onClick={() => toggleAvailability(car._id)}
                                                title={car.isAvailable ? 'Hide from search' : 'Make available'}
                                                className='text-xs px-2.5 py-1 border border-borderColor rounded hover:bg-gray-50 transition-colors cursor-pointer'
                                            >
                                                {car.isAvailable ? 'Hide' : 'Show'}
                                            </button>
                                            <button
                                                onClick={() => deleteCar(car._id)}
                                                title="Delete car"
                                                className='cursor-pointer p-1 hover:bg-red-50 rounded transition-colors'
                                            >
                                                <img
                                                    src={assets.delete_icon}
                                                    alt="Delete"
                                                    className='w-4 h-4'
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ManageCars
