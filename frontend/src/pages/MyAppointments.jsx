import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from "../config";
import { Link } from 'react-router-dom';

const MyAppointments = () => {
    const [approvedAppointments, setApprovedAppointments] = useState([]);
    const doctorId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : '';

    useEffect(() => {
        fetchAppointments();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10) % 12 || 12;
        const ampm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
        return `${hour}:${minutes} ${ampm}`;
    };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/appointment/fetch/${doctorId}`);
            const approvedAppointments = response.data.filter(appointment => appointment.status === "booked");
            setApprovedAppointments(approvedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
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

    const markAsCompleted = async (id, appointmentDate, startTime) => {
        const currentDate = formatDate(new Date());
        const formattedAppointmentDate = formatDate(appointmentDate);
        const formattedStartTime = formatTime(startTime);
        const currentTime = formatTime(new Date().toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}));
        
        if (currentDate >= formattedAppointmentDate && currentTime > formattedStartTime) {
            try {
                await axios.put(`${BASE_URL}/appointment/markAsCompleted/${id}`);
                alert("Appointment Completed Successfully!");
                fetchAppointments();
            } catch (error) {
                console.error('Error marking appointment as completed:', error);
            }
        } else {
            alert("You can only mark the appointment as completed on or after the appointment start time.");
        }
    };
    

    return (
        <div className="flex  h-screen">
            <div className="w pr-4">
                {approvedAppointments.length === 0 ? (
                    <p className="text-center">You have No Upcoming Appointments, <Link to="/doctor/pendingRequests" className="text-blue-500">check Pending Requests</Link></p>
                ) : (
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Start Time</th>
                                <th className="px-4 py-2">End Time</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedAppointments.map(appointment => (
                                <tr key={appointment._id}>
                                    <td className="border px-4 py-2">{formatDate(appointment.appointment_date)}</td>
                                    <td className="border px-4 py-2">{formatTime(appointment.start_time)}</td>
                                    <td className="border px-4 py-2">{formatTime(appointment.end_time)}</td>
                                    <td className="border px-4 py-2">
                                    <button 
                                        disabled={
                                            new Date() < new Date(formatDate(appointment.appointment_date)) || 
                                            (new Date().toDateString() === new Date(formatDate(appointment.appointment_date)).toDateString() && new Date().toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}) < formatTime(appointment.start_time))
                                        } 
                                        onClick={() => markAsCompleted(appointment._id, appointment.appointment_date, appointment.start_time)} 
                                        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600`}
                                        style={{ cursor: (new Date() < new Date(formatDate(appointment.appointment_date)) || (new Date().toDateString() === new Date(formatDate(appointment.appointment_date)).toDateString() && new Date().toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}) < formatTime(appointment.start_time))) ? 'not-allowed' : 'pointer' }}
                                    >
                                        Mark as Completed
                                    </button>







                                        <button onClick={() => cancelAppointment(appointment._id)} className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600">Cancel</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
