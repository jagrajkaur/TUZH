import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from "../config";

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

    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-1/2 pr-4">
                <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
                <ul>
                    {approvedAppointments.map(appointment => (
                        <li key={appointment._id} className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-2">
                            <span>{new Date(appointment.appointment_date).toLocaleDateString()} - {formatTime(appointment.start_time)} to {formatTime(appointment.end_time)}</span>
                            <button onClick={() => cancelAppointment(appointment._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyAppointments;
