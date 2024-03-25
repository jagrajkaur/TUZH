import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../config";

const DoctorDashboard = () => {
    // Get doctor ID from local storage
    const doctorId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : '';

    const [appointmentDate, setAppointmentDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const getCurrentDate = () => {
        const today = new Date();
        // Format the current date as "YYYY-MM-DD" required by the input type="date"
        const currentDate = today.toISOString().split('T')[0];
        return currentDate;
    };
    
    const getNextWeekDate = () => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7); // Add 7 days
        // Format the next week date as "YYYY-MM-DD" required by the input type="date"
        const nextWeekDate = nextWeek.toISOString().split('T')[0];
        return nextWeekDate;
    };
    
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const appointmentData = {
            doctor_id: doctorId,
            appointment_date: appointmentDate,
            start_time: startTime,
            end_time: endTime
        };
    
        console.log('Creating appointment with data:', appointmentData);
    
        try {
            const response = await axios.post(`${BASE_URL}/appointment/createAppointment`, appointmentData);
            console.log('Appointment created:', response.data);
            // Reset form fields after successful submission
            setAppointmentDate('');
            setStartTime('');
            setEndTime('');
        } catch (error) {
            console.error('Error creating appointment:', error);
        }
    };
    

    return (
        <section className="px-5 lg:px-0">
            <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
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
                            min={getCurrentDate()} // Set min attribute to current date
                            max={getNextWeekDate()} // Set max attribute to next week date
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
        </section>
    );
};

export default DoctorDashboard;
