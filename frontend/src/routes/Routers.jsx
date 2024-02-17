import React from "react";
import Home from "../pages/Home";
import Services from "../pages/Services";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Contact from "../pages/Contact";

import { Routes, Route } from "react-router-dom";

const Routers = () => {
    return <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
    </Routes>
};

export default Routers;