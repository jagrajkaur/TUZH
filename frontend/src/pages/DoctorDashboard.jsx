import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from "../config";

const DoctorDashboard = () => {
    // Get doctor ID from local storage
    const doctorId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : '';

    const [appointments, setAppointments] = useState([]);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        fetchAppointments();
        fetchPendingRequests();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/appointment/fetch/${doctorId}`);
            const sortedAppointments = response.data.sort((a, b) => {
                const dateComparison = new Date(a.appointment_date) - new Date(b.appointment_date);
                if (dateComparison !== 0) {
                    return dateComparison;
                }
                return a.start_time.localeCompare(b.start_time);
            });
            setAppointments(sortedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/appointment/getPendingAppointments/${doctorId}`);
            setPendingRequests(response.data);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    const cancelAppointment = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/appointment/deleteAppointment/${id}`);
            fetchAppointments();
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        }
    };

    const acceptRequest = async (id) => {
        try {
            await axios.put(`${BASE_URL}/appointment/acceptRequest/${id}`);
            fetchPendingRequests();
        } catch (error) {
            console.error('Error accepting appointment request:', error);
        }
    };

    const rejectRequest = async (id) => {
        try {
            await axios.put(`${BASE_URL}/appointment/rejectRequest/${id}`);
            fetchPendingRequests();
        } catch (error) {
            console.error('Error rejecting appointment request:', error);
        }
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10) % 12 || 12;
        const ampm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
        return `${hour}:${minutes} ${ampm}`;
    };

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
            setAppointmentDate('');
            setStartTime('');
            setEndTime('');
            fetchAppointments();
        } catch (error) {
            console.error('Error creating appointment:', error);
        }
    };

    return (
        <section className="px-5 lg:px-0 flex">
            {/* Left Section: Appointments List */}
            <div className="w-1/2 pr-4">
                <h2 className="text-lg font-semibold mb-2">My Availabilities</h2>
                <ul>
                    {appointments.map(appointment => (
                        <li key={appointment._id} className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-2">
                            <span>{new Date(appointment.appointment_date).toLocaleDateString()} - {formatTime(appointment.start_time)} to {formatTime(appointment.end_time)}</span>
                            <button onClick={() => cancelAppointment(appointment._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Middle Section: Pending Appointment Requests */}
            <div className="w-1/2 pr-4">
                <h2 className="text-lg font-semibold mb-2">Pending Appointment Requests</h2>
                <ul>
                    {pendingRequests.map(request => (
                        <li key={request._id} className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-2">
                            <span>Date: {new Date(request.appointment_date).toLocaleDateString()}</span>
                            <span>Start Time: {formatTime(request.start_time)}</span>
                            <span>End Time: {formatTime(request.end_time)}</span>
                            <span>Patient: {request.patientEmail}</span>
                            <div>
                                <button onClick={() => acceptRequest(request._id)} className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">Accept</button>
                                <button onClick={() => rejectRequest(request._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Section: Form to Create Appointments */}
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
        </section>
    );
};

export default DoctorDashboard;

