import express from "express"
import { protect } from "../middlewares/auth.js"
import { addCar, deleteCar, getCars, getCarById, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerController.js"
import upload from "../middlewares/multer.js"

const ownerRouter=express.Router()

ownerRouter.post('/add-car',upload.single("image"),protect,addCar)
ownerRouter.get('/all-cars',getCars)
ownerRouter.get('/cars/:id', getCarById)
ownerRouter.get('/cars',protect,getOwnerCars)
ownerRouter.post('/toggle-car',protect,toggleCarAvailability)
ownerRouter.post('/delete-car',protect,deleteCar)
ownerRouter.post('/update-image',upload.single('image'),protect,updateUserImage)

ownerRouter.get('/dashboard',protect,getDashboardData)

export default ownerRouter
