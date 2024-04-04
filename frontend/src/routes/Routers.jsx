
import Home from "../pages/Home";
import Login from "../pages/Login1";
import Signup from "../pages/Signup1";
import Contact from "../pages/Contact";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import BookAppointment from "../pages/BookAppointment";
import AddAvailability from "../pages/AddAvailability";
import MySchedule from "../pages/MySchedule";
import RequestedAppointments from "../pages/RequestedAppointments";
import MyAppointments from "../pages/MyAppointments";
import PatientAppointments from "../pages/PatientAppointment";
import MyTasks from "../pages/MyTasks";
import Profile from "../pages/Profile";

import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";

const Routers = () => {
    const { user, role } = useContext(authContext);

    // Check if the user is logged in and has the role of "admin" or "doctor"
    const isAdmin = role && role === "Admin";
    const isDoctor = role && role === "Doctor";
    const isPatient = role && role === "Patient";

    return <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={user ? <HomeLoggedIn /> : <Home/>} />
        <Route path="/register" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/profile" element={user ? <Profile/> : <Navigate to="/" replace /> } />

        {/* Routes associated with patients */}
        <Route path="/bookappointment" element={user && isPatient ? <BookAppointment/> : isDoctor ? <Navigate to="/" replace /> : <Login/>} />
        <Route path="/PatientAppointments" element={user && isPatient ? <PatientAppointments/> : isDoctor ? <Navigate to="/" replace /> : <Login/>} />
        <Route path="/mytasks" element={user && isPatient ? <MyTasks/> : isDoctor ? <Navigate to="/" replace /> : <Login/>} />
        
        {/* Check if user is admin, navigate to AdminDashboard if true */}
        <Route path="/dashboard" element={isAdmin ? <AdminDashboard /> : isDoctor ? <DoctorDashboard /> : user ? <Dashboard/> : <Login/>} />
        
        {/* Routes associated with doctors */}
        <Route path="/doctor/addAvailablity" element={user && isDoctor ? <AddAvailability/> : isPatient ? <Navigate to="/" replace /> : <Login/>} />
        <Route path="/doctor/myAvailability" element={user && isDoctor ? <MySchedule/> : isPatient ? <Navigate to="/" replace /> : <Login/>} />
        <Route path="/doctor/myAppointments" element={user && isDoctor ? <MyAppointments/> : isPatient ? <Navigate to="/" replace /> : <Login/>} />
        <Route path="/doctor/pendingRequests" element={user && isDoctor ? <RequestedAppointments/> : isPatient ? <Navigate to="/" replace /> : <Login/>} />
        

        {/* Catch-all route for handling undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
};

const HomeLoggedIn = () => {
    return <Navigate to="/dashboard" />
}

export default Routers;
