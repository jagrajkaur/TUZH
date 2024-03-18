import Home from "../pages/Home";
import Login from "../pages/Login1";
import Signup from "../pages/Signup1";
import Contact from "../pages/Contact";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";

import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";

const Routers = () => {
    const { user } = useContext(authContext);

    return <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={user ? <HomeLoggedIn /> : <Home/>} />
        <Route path="/register" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Signup/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/AdminDashboard" element={<AdminDashboard/>} />
    </Routes>
};

const HomeLoggedIn = () => {
    return <Navigate to="/dashboard" />
}

export default Routers;