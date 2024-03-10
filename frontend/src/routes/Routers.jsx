import Home from "../pages/Home";
import Login from "../pages/Login1";
import Signup from "../pages/Signup1";
import Contact from "../pages/Contact";

import { Routes, Route } from "react-router-dom";

const Routers = () => {
    return <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/register" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Signup/>} />
        <Route path="/contact" element={<Contact/>} />
    </Routes>
};

export default Routers;