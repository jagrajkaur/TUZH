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

import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";

const Routers = () => {
    const { user, role } = useContext(authContext);

    // Check if the user is logged in and has the role of "admin" or "doctor"
    const isAdmin = role && role === "Admin";
    const isDoctor = role && role === "Doctor";


    return <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={user ? <HomeLoggedIn /> : <Home/>} />
        <Route path="/register" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/bookappointment" element={user ? <BookAppointment/> : <Login/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/PatientAppointments" element={<PatientAppointments/>} />
        {/* Check if user is admin, navigate to AdminDashboard if true */}
        <Route path="/dashboard" element={isAdmin ? <AdminDashboard /> : isDoctor ? <DoctorDashboard /> : user ? <Dashboard/> : <Login/>} />
        <Route path="/doctor/addAvailablity" element={<AddAvailability/>} />
        <Route path="/doctor/myAvailability" element={<MySchedule/>} />
        <Route path="/doctor/myAppointments" element={<MyAppointments/>} />
        <Route path="/doctor/pendingRequests" element={<RequestedAppointments/>} />
    </Routes>
};

const HomeLoggedIn = () => {
    return <Navigate to="/dashboard" />
}

export default Routers;