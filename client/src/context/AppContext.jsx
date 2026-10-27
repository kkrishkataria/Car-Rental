import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {toast} from 'react-hot-toast'

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL

export const AppContext=createContext()
export const AppProvider=({children})=>{
    const currency=import.meta.env.VITE_CURRENCY
    const navigate=useNavigate()
    const [token,setToken]=useState(null)
    const [user,setUser]=useState(null)
    const [isOwner,setIsOwner]=useState(false)
    const [showLogin,setShowLogin]=useState(false)
    const [pickupDate,setPickupDate]=useState('')
    const [returnDate,setReturnDate]=useState('')
    const [cars,setCars]=useState([])
    const fetchUser=async()=>{
        try {
            const {data}=await axios.get('/api/user/data')
            if(data.success && data.user){
                setUser(data.user)
                setIsOwner(data.user.role==='owner')
            }
            else {
                navigate('/')
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    const fetchCars=async()=>{
        try {
            const {data}=await axios.get('/api/owner/all-cars')
            if(data.success){
                setCars(data.cars)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout=async()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization']=''
        toast.success('You have been logged out!')
    }

    useEffect(()=>{
        const savedToken=localStorage.getItem('token')
        if(savedToken){
            axios.defaults.headers.common['Authorization']=savedToken
            setToken(savedToken)
        }
        fetchCars()
    },[])

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['Authorization']=`${token}`
            fetchUser()
        }
    },[token])

    const value={
        navigate,currency,axios,user,setUser,token,setToken,isOwner,setIsOwner,fetchUser,showLogin,setShowLogin,logout,fetchCars,cars,setCars,pickupDate,returnDate,setPickupDate,setReturnDate
    }
    return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
    )
}

export const UseAppContext=()=>{
    return useContext(AppContext)
}
