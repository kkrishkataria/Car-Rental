import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {toast} from 'react-hot-toast'

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL

export const AppContext=createContext()
export const AppProvider=({children})=>{
    const currency=import.meta.env.VITE_CURRENCY
    const navigate=useNavigate()
    const [token,setToken]=useState(localStorage.getItem('token') || null)
    const [user,setUser]=useState(null)
    const [isOwner,setIsOwner]=useState(localStorage.getItem('role') === 'owner')
    const [showLogin,setShowLogin]=useState(false)
    const [pickupDate,setPickupDate]=useState('')
    const [returnDate,setReturnDate]=useState('')
    const [cars,setCars]=useState([])
    const fetchUser=async()=>{
        try {
            const {data}=await axios.get('/api/user/data')
            if(data.success && data.user){
                setUser(data.user)
                const isUserOwner = data.user.role === 'owner'
                setIsOwner(isUserOwner)
                localStorage.setItem('role', data.user.role)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('role')
                setToken(null)
                setUser(null)
                setIsOwner(false)
                axios.defaults.headers.common['Authorization']=''
            } else {
                toast.error(error.message)
            }
        }

    }

    const fetchCars = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/owner/all-cars')
            if (data.success) {
                setCars(data.cars)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [])

    const logout=async()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization']=''
        navigate('/')
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
