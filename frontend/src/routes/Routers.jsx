import Home from "../pages/Home";
import Login from "../pages/Login1";
import Signup from "../pages/Signup1";
import Contact from "../pages/Contact";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";

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
        <Route path="/register" element={<Signup/>} />
        <Route path="/contact" element={<Contact/>} />
        {/* Check if user is admin, navigate to AdminDashboard if true */}
        <Route path="/dashboard" element={isAdmin ? <AdminDashboard /> : isDoctor ? <DoctorDashboard /> : user ? <Dashboard/> : <Login/>} />
    </Routes>
};

const HomeLoggedIn = () => {
    return <Navigate to="/dashboard" />
}

export default Routers;