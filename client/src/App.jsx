import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import CarDetails from './pages/CarDetails'
import Home from './pages/Home'
import Cars from './pages/Cars'
import Footer from './components/Footer'
import MyBookings from './pages/MyBookings'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './components/Login'
import {Toaster} from 'react-hot-toast'
import { UseAppContext } from './context/AppContext'

const App = () => {
  const {showLogin,setShowLogin,isOwner}=UseAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')
  return (
    <div>
      <Toaster/>
      {showLogin&&<Login/>}
      {!isOwnerPath && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={isOwner ? <Navigate to='/owner/manage-bookings' replace /> : <MyBookings />} />
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>
      </Routes>
      {!isOwnerPath && <Footer />}
    </div>
  )
}

export default App
