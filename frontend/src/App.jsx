import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/User/Home';
import About from './pages/User/Contact';
import Contact from './pages/User/About';
import Doctors from './pages/User/Doctor';
import DoctorDetail from './pages/User/DoctorDetail';
import Branches from './pages/User/Branches';
import InfoBranches from './pages/User/Branchs/InfoBranch';
import Department from './pages/User/Department';
import Booking from './pages/User/Booking';
import Login from './pages/User/Login';
import MainLayout from './layouts/MainLayout';
import DoctorListPage from './pages/User/Listofdoctors';
import ShowDetailDoctor from './pages/User/Booking/ShowDetailDoctor';
import AI from './pages/User/SymptomAnalyzer';
import MyProfile from './pages/User/MyProfile';
import New from './pages/User/HealthNews';


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorDetail />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/infobranches" element={<InfoBranches />} />
        <Route path='/booking' element={<Booking />} />
        <Route path="/department" element={<Department />} />
        <Route path="/login" element={<Login />} />
        <Route path="/showdr" element={<DoctorListPage />} />
        <Route path="/drdetail" element={<ShowDetailDoctor />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/new" element={<New />} />
        <Route path="/my-profile" element={<MyProfile />} />
      </Route>
    </Routes>
  )
}

export default App