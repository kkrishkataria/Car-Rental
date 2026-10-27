import Booking from '../models/booking.js'
import Car from '../models/car.js'

const checkAvalabilityOfDate=async(car,pickupDate,returnDate)=>{
    const bookings=await Booking.find({
        car,
        status: { $ne: 'cancelled' },
        pickupDate:{$lte:returnDate},
        returnDate:{$gte:pickupDate}
    })
    return bookings.length===0
}

export const checkAvalabilityOfCar=async(req,res)=>{
    try {
        const {location,pickupDate,returnDate}=req.body
        const confirmedBookedCarIds = await Booking.find({ status: "confirmed" }).distinct("car");
        const cars=await Car.find({
            _id: { $nin: confirmedBookedCarIds },
            location,
            isAvailable:true
        })
        const availableCars=await Promise.all(
            cars.map(async (car) => ({
                ...car.toObject(),
                isAvailable: await checkAvalabilityOfDate(
                    car._id,
                    pickupDate,
                    returnDate
                )
            }))
        );
        res.json({
            success: true,
            availableCars: availableCars.filter(car => car.isAvailable)
        });

    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

export const createBooking=async(req,res)=>{
    try {
        const {_id}=req.user
        const {car,pickupDate,returnDate}=req.body
        const isConfirmedBooked = await Booking.exists({ car, status: 'confirmed' });
        if (isConfirmedBooked) return res.json({ success: false, message: 'This car is already confirmed booked!' })
        const isAvailable=await checkAvalabilityOfDate(car,pickupDate,returnDate)
        if(!isAvailable) return res.json({success:false,message:'Car is Not Available!'})
        const carData=await Car.findById(car)
        if (!carData || !carData.isAvailable) return res.json({ success: false, message: 'Car is Not Available!' })
        const picked=new Date(pickupDate)
        const returned=new Date(returnDate)
        const noOfDays=Math.ceil((returned-picked)/(1000*60*60*24))
        const price=carData.pricePerDay*noOfDays
        await Booking.create({user:_id,car,owner:carData.owner,pickupDate,returnDate,price})
        return res.json({success:true,message:'Booking Created!'})


    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

export const getUserBookings=async(req,res)=>{
    try {
        const {_id}=req.user
        const bookings=await Booking.find({user:_id}).populate("car").sort({createdAt:-1})
        return res.json({success:true,bookings})
        
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

export const getOwnerBookings=async(req,res)=>{
    try {
        if(req.user.role!=="owner") return res.json({success:false,message:"Unauthorized"})
        const {_id}=req.user
        const bookings=await Booking.find({owner:_id}).populate("car user").select('-user.password').sort({createdAt:-1})
        return res.json({success:true,bookings})
        
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

export const changeBookingStatus=async(req,res)=>{
    try {
        const {_id}=req.user
        const {bookingId,status}=req.body
        const booking=await Booking.findById(bookingId)
        if(!booking) return res.json({success:false,message:"Booking not found"})
        if(_id.toString()!==booking.owner.toString()) return res.json({success:false,message:"Unauthorized"})
        booking.status=status
        await booking.save()

        if (status === 'confirmed') {
            await Car.findByIdAndUpdate(booking.car, { isAvailable: false })
        } else if (status === 'cancelled') {
            const hasOtherConfirmed = await Booking.exists({ car: booking.car, status: 'confirmed', _id: { $ne: booking._id } })
            if (!hasOtherConfirmed) {
                await Car.findByIdAndUpdate(booking.car, { isAvailable: true })
            }
        }

        return res.json({success:true,message:'Booking Status Updated!'})
        
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

