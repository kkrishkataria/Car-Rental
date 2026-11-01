import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { UseAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {
    const { axios, currency, fetchCars } = UseAppContext()
    const [bookings, setBookings] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchOwnerBookings = async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get('/api/bookings/owner')
            if (data.success) {
                setBookings(data.bookings)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const changeBookingStatus = async (bookingId, status) => {
        if (status === 'cancelled') {
            const confirmed = window.confirm('Are you sure you want to cancel this booking?')
            if (!confirmed) return
        }
        try {
            const { data } = await axios.post('/api/bookings/change-status', { bookingId, status })
            if (data.success) {
                toast.success(data.message)
                fetchOwnerBookings()
                if (fetchCars) fetchCars()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchOwnerBookings()
    }, [])

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>
            <Title
                title="Manage Bookings"
                subTitle="View all bookings, update their status, or check booking details."
            />

            {isLoading ? (
                <div className="py-16 text-center text-sm text-gray-400">Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div className="mt-10 text-center py-16 border border-dashed border-borderColor rounded-lg max-w-5xl">
                    <p className="text-gray-500 font-medium">No bookings yet</p>
                    <p className="text-gray-400 text-sm mt-1">Bookings from customers will appear here.</p>
                </div>
            ) : (
                <div className='max-w-5xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
                    <table className='w-full border-collapse text-left text-sm text-gray-600'>
                        <thead className='text-gray-500'>
                            <tr>
                                <th className='p-3 font-medium'>Car</th>
                                <th className='p-3 font-medium max-md:hidden'>Date Range</th>
                                <th className='p-3 font-medium'>Total</th>
                                <th className='p-3 font-medium max-md:hidden'>Payment</th>
                                <th className='p-3 font-medium'>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.map((booking) => (
                                <tr
                                    key={booking._id}
                                    className='border-t border-borderColor text-gray-500'
                                >
                                    <td className='p-3 flex items-center gap-3'>
                                        <img
                                            src={booking.car?.image || ''}
                                            alt=""
                                            className='h-12 w-12 aspect-square rounded-md object-cover bg-gray-100'
                                        />

                                        <div className='max-md:hidden'>
                                            <p className='font-medium text-gray-600'>
                                                {booking.car?.brand} {booking.car?.model}
                                            </p>
                                        </div>
                                    </td>

                                    <td className='p-3 max-md:hidden'>
                                        {booking.pickupDate ? booking.pickupDate.split('T')[0] : ''} to{' '}
                                        {booking.returnDate ? booking.returnDate.split('T')[0] : ''}
                                    </td>

                                    <td className='p-3'>
                                        {currency}{booking.price}
                                    </td>

                                    <td className='p-3 max-md:hidden'>
                                        <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>
                                            offline
                                        </span>
                                    </td>

                                    <td className='p-3'>
                                        {booking.status === 'pending' ? (
                                            <select
                                                value={booking.status}
                                                onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                                                className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none bg-white'
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="confirmed">Confirmed</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-red-100 text-red-500'
                                                }`}
                                            >
                                                {booking.status}
                                            </span>
                                        )}
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

export default ManageBookings
