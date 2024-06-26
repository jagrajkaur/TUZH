import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { BASE_URL } from "../config";

const AddAvailability = () => {
    // State for form inputs
    const [appointmentDate, setAppointmentDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const doctorId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : '';
    const getCurrentDate = () => {
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0];
        return currentDate;
    };

    const getNextWeekDate = () => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekDate = nextWeek.toISOString().split('T')[0];
        return nextWeekDate;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if end time is greater than start time
        if (new Date(`1970-01-01T${endTime}`) <= new Date(`1970-01-01T${startTime}`)) {
            toast.error("End time should be greater than start time.");
            setEndTime('');
            return;
        }

        // Calculate the duration in minutes
        const start = new Date(`1970-01-01T${startTime}`);
        const end = new Date(`1970-01-01T${endTime}`);
        const durationInMinutes = (end - start) / 60000;

        // Check if the duration is between 30 minutes and 2 hours (120 minutes)
        if (durationInMinutes < 30 || durationInMinutes > 120) {
            toast.error("The duration should be between 30 minutes and 2 hours.");
            setEndTime('');
            setStartTime('');
            return;
        }
    
        const appointmentData = {
            doctor_id: doctorId,
            appointment_date: appointmentDate,
            start_time: startTime,
            end_time: endTime
        };
    
        try {
            const response = await axios.post(`${BASE_URL}/appointment/createAppointment`, appointmentData);
            
            if (response.data.message === "exists"){
                toast.error("Availability Already Exists !");
            }
            else{
                toast.success("Availability Added Auccessfully!");  
            }
            setAppointmentDate('');
            setStartTime('');
            setEndTime('');  
        } catch (err) {
            toast.error(err.message);  
        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-1/2 pl-4 bg-gray-100 rounded-lg shadow-md">
                <div className="w-full max-w-[570px] mx-auto md:p-10">
                    <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
                        New Availability
                    </h3>

                    <form className="py-4 md:py-0" onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label htmlFor="appointmentDate" className="block text-headingColor text-sm font-semibold mb-2">Appointment Date</label>
                            <input 
                                type="date" 
                                id="appointmentDate"
                                placeholder="Appointment Date" 
                                value={appointmentDate} 
                                onChange={(e) => setAppointmentDate(e.target.value)} 
                                min={getCurrentDate()} 
                                max={getNextWeekDate()} 
                                className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                                focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                                placeholder:text-textColor cursor-pointer"
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="startTime" className="block text-headingColor text-sm font-semibold mb-2">Start Time</label>
                            <input 
                                type="time" 
                                id="startTime"
                                placeholder="Start Time" 
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)} 
                                className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                                focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                                placeholder:text-textColor cursor-pointer"
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="endTime" className="block text-headingColor text-sm font-semibold mb-2">End Time</label>
                            <input 
                                type="time" 
                                id="endTime"
                                placeholder="End Time" 
                                value={endTime} 
                                onChange={(e) => setEndTime(e.target.value)} 
                                className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                                focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                                placeholder:text-textColor cursor-pointer"
                                required
                            />
                        </div>

                        <div className="mt-7">
                            <button 
                                type="submit" 
                                className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAvailability;
