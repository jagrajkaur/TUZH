import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from "../config";
import { Link } from 'react-router-dom';

const MyAppointments = () => {
    // State to store approved appointments
    const [approvedAppointments, setApprovedAppointments] = useState([]);
    const doctorId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : '';

    useEffect(() => {
        fetchAppointments();
    }, []);

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10) % 12 || 12;
        const ampm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
        return `${hour}:${minutes} ${ampm}`;
    };

    // Function to fetch appointments
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/appointment/fetch/${doctorId}`);
            // Filter appointments with status "approved"
            const approvedAppointments = response.data.filter(appointment => appointment.status === "booked");
            setApprovedAppointments(approvedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    // Function to cancel an appointment
    const cancelAppointment = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/appointment/deleteAppointment/${id}`);
            fetchAppointments();
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        }
    };

    // Function to mark appointment as completed
    const markAsCompleted = async (id) => {
        try {
            await axios.put(`${BASE_URL}/appointment/markAsCompleted/${id}`);
            alert("Appointment Completed Successfully!")
            fetchAppointments();
        } catch (error) {
            console.error('Error marking appointment as completed:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-1/2 pr-4">
                <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
                {approvedAppointments.length === 0 ? (
                    <p>You have No Upcoming Appointments, <Link to="/doctor/pendingRequests" className="text-blue-500">check Pending Requests</Link></p>
                ) : (
                    <ul>
                        {approvedAppointments.map(appointment => (
                            <li key={appointment._id} className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-2">
                                <span>{new Date(appointment.appointment_date).toLocaleDateString()} - {formatTime(appointment.start_time)} to {formatTime(appointment.end_time)}</span>
                                <div>
                                <button onClick={() => markAsCompleted(appointment._id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Mark as Completed</button>
                                &nbsp; &nbsp;<button onClick={() => cancelAppointment(appointment._id)} className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600">Cancel</button> 
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
