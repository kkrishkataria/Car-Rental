import imagekit from "../configs/imagekit.js"
import User from "../models/user.js"
import Car from "../models/car.js"
import fs from 'fs'

export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user
        await User.findByIdAndUpdate(_id, { role: "owner" })
        res.json({ success: true, message: "Now you can list cars!" })

    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

export const addCar = async (req, res) => {
    try {
        const { _id } = req.user
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
        const { _id } = req.user;

        const cars = await Car.find({ owner: _id });

        res.json({ success: true, cars });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


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

        car.isAvailable = !car.isAvailable;

        await car.save();

        res.json({ success: true, car });

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

        res.json({
            success: true,
            cars
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};