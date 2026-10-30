import imagekit from "../configs/imagekit.js"
import User from "../models/user.js"
import Car from "../models/car.js"
import fs from 'fs'
import Booking from "../models/booking.js"

export const addCar = async (req, res) => {
    try {
        const { _id, role } = req.user
        if (role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" })
        }
        let car = JSON.parse(req.body.carData)
 
        const imageFile = req.file
        const filebuffer = fs.readFileSync(imageFile.path)
        const uploadResponse = await imagekit.upload({ file: filebuffer, fileName: imageFile.originalname, folder: '/cars' })

        // Optimization through ImageKit URL transformation
        var optimizedImageUrl = imagekit.url({
            path: uploadResponse.filePath,
            transformation: [
                { width: '1280' }, // Width resizing
                { quality: 'auto' }, // Auto compression
                { format: 'webp' } // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        await Car.create({...car,owner:_id,image})
        return res.json({success:true,message:"Car Added!"})


    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

export const getOwnerCars = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if (role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const cars = await Car.find({ owner: _id });

        res.json({ success: true, cars });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const getCars = async (req, res) => {
    try {
        const bookedCarIds = await Booking.find({
            status: { $in: ["confirmed", "pending"] }
        }).distinct("car");
        const cars = await Car.find({
            _id: { $nin: bookedCarIds },
            isAvailable: true
        });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const getCarById = async (req, res) => {
    try {
        const { id } = req.params
        const car = await Car.findById(id)
        if (!car) return res.json({ success: false, message: 'Car not found' })
        res.json({ success: true, car })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;

        const car = await Car.findById(carId);

        if (!car) {
            return res.json({
                success: false,
                message: "Car not found"
            });
        }

        if (car.owner.toString() !== _id.toString()) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        const isConfirmedBooked = await Booking.exists({ car: carId, status: "confirmed" });
        if (isConfirmedBooked && !car.isAvailable) {
            return res.json({
                success: false,
                message: "Cannot mark available while car has a confirmed booking"
            });
        }

        car.isAvailable = !car.isAvailable;

        await car.save();

        res.json({
            success: true,
            message: `Car marked as ${car.isAvailable ? "available" : "unavailable"}`,
            car
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;

        const car = await Car.findById(carId);

        if (!car) {
            return res.json({
                success: false,
                message: "Car not found"
            });
        }

        if (car.owner.toString() !== _id.toString()) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        await Car.findByIdAndDelete(carId);

        res.json({
            success: true,
            message: "Car deleted successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
}

export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (role !== 'owner') {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        const cars = await Car.find({ owner: _id });
        const bookings=await Booking.find({owner:_id}).populate("car").sort({createdAt:-1})
        const pendingbookings=await Booking.find({owner:_id,status:"pending"}).populate("car").sort({createdAt:-1})
        const confirmedbookings=await Booking.find({owner:_id,status:"confirmed"}).populate("car").sort({createdAt:-1})

        const monthlyRevenue=bookings.slice().filter(bookings=>bookings.status==="confirmed").reduce((acc,booking)=>acc+booking.price,0)

        const dashboardData={
            totalCars:cars.length,
            totalBookings:bookings.length,
            pendingBookings:pendingbookings.length,
            confirmedBookings:confirmedbookings.length,
            recentBookings:bookings.slice(0,3),
            monthlyRevenue
        }
        res.json({
            success: true,
            dashboardData
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export const updateUserImage=async(req,res)=>{
    try {
        const {_id}=req.user
        const imageFile=req.file
        const filebuffer = fs.readFileSync(imageFile.path)
        const uploadResponse = await imagekit.upload({ file: filebuffer, fileName: imageFile.originalname, folder: '/users' })
        var optimizedImageUrl = imagekit.url({
            path: uploadResponse.filePath,
            transformation: [
                { width: '1280' }, // Width resizing
                { quality: 'auto' }, // Auto compression
                { format: 'webp' } // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        await User.findByIdAndUpdate(_id,{image})
        res.json({success:true,message:"Image Updated!"})


    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
}
