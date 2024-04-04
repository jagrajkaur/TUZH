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

    // Function to fetch pending appointment requests for the upcoming week
    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/appointment/getPendingAppointments/${doctorId}`);
            const upcomingWeek = getUpcomingWeekDates();
            const filteredRequests = response.data.filter(request => {
                const requestDate = new Date(request.appointment_date);
                return upcomingWeek.some(date => isSameDay(date, requestDate));
            });
            setPendingRequests(filteredRequests);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    // Function to get dates for the upcoming week
    const getUpcomingWeekDates = () => {
        const today = new Date();
        const upcomingWeek = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            upcomingWeek.push(date.toISOString().split('T')[0]); // Get date in YYYY-MM-DD format
        }
        return upcomingWeek;
    };

    // Function to check if two dates are the same day
    const isSameDay = (date1, date2) => {
        try {
            // Ensure date1 and date2 are valid Date objects
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            
            // Check if they represent the same day
            return d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();
        } catch (error) {
            console.error('Error checking if same day:', error);
            return false; // Return false if an error occurs
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
        <div className="flex justify-center items-center h-screen">
        <div className="w pr-4">
            {pendingRequests.length === 0 ? (
                <p className="text-center">You have no new booking requests, <Link to="/doctor/myAppointments" className="text-blue-500">check Upcoming Appointments</Link></p>
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
