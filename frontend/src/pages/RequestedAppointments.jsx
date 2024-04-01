import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from "../config";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const RequestedAppointments = () => {
    // State to store pending appointment requests
    const [pendingRequests, setPendingRequests] = useState([]);
    const doctorId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : '';

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    // Function to fetch pending appointment requests
    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/appointment/getPendingAppointments/${doctorId}`);
            setPendingRequests(response.data);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    // Function to accept a request
    const acceptRequest = async (id) => {
        try {
            await axios.put(`${BASE_URL}/appointment/acceptRequest/${id}`);
            fetchPendingRequests();
        } catch (error) {
            console.error('Error accepting appointment request:', error);
        }
    };

    // Function to reject a request
    const rejectRequest = async (id) => {
        try {
            await axios.put(`${BASE_URL}/appointment/rejectRequest/${id}`);
            fetchPendingRequests();
        } catch (error) {
            console.error('Error rejecting appointment request:', error);
        }
    };
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to format time
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10) % 12 || 12;
        const ampm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
        return `${hour}:${minutes} ${ampm}`;
    };

    return (
        <div>
            <div className="w-1/3 pr-4">
                <h2 className="text-lg font-semibold mb-2">Booking Requests</h2>
                {pendingRequests.length === 0 ? (
                    <p>You have no new booking requests, <Link to="/doctor/myAppointments" className="text-blue-500">check Upcoming Appointments</Link></p>
                ) : (
                    <ul>
                        {pendingRequests.map(request => (
                            <li key={request._id} className="bg-gradient-to-b from-blue-300 to-purple-300 flex flex-col bg-white rounded-lg shadow-md p-4 mb-2">
                                <div className="flex justify-between mb-2">
                                <span>{request.patientEmail}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span><b>{formatDate(request.appointment_date)}</b></span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{formatTime(request.start_time)} - {formatTime(request.end_time)}</span>    
                                </div>
                                <div>
                                        <button onClick={() => acceptRequest(request._id)} className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">Accept</button>
                                        <button onClick={() => rejectRequest(request._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reject</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default RequestedAppointments;
