import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { BASE_URL } from "../config";

const MySchedule = () => {
    // State to store appointments
    const [appointments, setAppointments] = useState([]);
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

    // Function to fetch appointments
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/appointment/fetch/${doctorId}`);
            const upcomingWeek = getUpcomingWeekDates();
            const filteredAppointments = response.data.filter(appointment => {
                const appointmentDate = new Date(appointment.appointment_date);
                return upcomingWeek.some(date => isSameDay(date, appointmentDate));
            });
            const sortedAppointments = filteredAppointments.sort((a, b) => {
                const dateComparison = new Date(a.appointment_date) - new Date(b.appointment_date);
                if (dateComparison === 0) {
                    return a.start_time.localeCompare(b.start_time);
                }
                return dateComparison;
            });
            setAppointments(sortedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const getUpcomingWeekDates = () => {
        const today = new Date();
        const upcomingWeek = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            upcomingWeek.push(date);
        }
        return upcomingWeek;
    };

    const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    // Function to cancel an appointment
    const deleteAppointment = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/appointment/deleteAppointment/${id}`);
            fetchAppointments();
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        }
    };

    // Function to update an appointment
    const updateAppointment = async (id, updatedAppointment) => {
        try {
            await axios.put(`${BASE_URL}/appointment/updateAppointment/${id}`, updatedAppointment);
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
                
                fetchAppointments();
                
            } catch (error) {
                console.error('Error updating appointment:', error);
            }
    };

    // Toggle whether the appointment is being edited
    const toggleEdit = (id) => {
        setAppointments(prevAppointments => {
            return prevAppointments.map(appointment => {
                if (appointment._id === id) {
                    return { ...appointment, isEditing: !appointment.isEditing };
                }
                return appointment;
            });
        });
    };

    // Handle input change for appointment details
    const handleInputChange = (id, e) => {
        const { name, value } = e.target;
        setAppointments(prevAppointments => {
            return prevAppointments.map(appointment => {
                if (appointment._id === id) {
                    return { ...appointment, [name]: value };
                }
                return appointment;
            });
        });
    };

    // Handle update button click
    const handleUpdate = (id) => {
        const updatedAppointment = appointments.find(appointment => appointment._id === id);
        updateAppointment(id, updatedAppointment);
        toggleEdit(id); // Toggle back to view mode after update
        toast.success("Availability Updated Successfully! ");
    };


    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-1/1.1 pr-4">
                <h2 className="text-lg font-semibold mb-2">My Availabilities</h2>
                <ul>
                    {appointments.map(appointment => (
                        <li key={appointment._id} className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-2">
                            <div>
                                <b>&#91; {formatDate(appointment.appointment_date)} &#93;</b> {/* Display date as read-only */}
                                {appointment.isEditing ? (
                                    <>
                                        <input
                                            type="time"
                                            name="start_time"
                                            value={appointment.start_time}
                                            onChange={(e) => handleInputChange(appointment._id, e)}
                                            className="border rounded px-2 py-1 mr-2" // Add border to time fields
                                        />
                                        <input
                                            type="time"
                                            name="end_time"
                                            value={appointment.end_time}
                                            onChange={(e) => handleInputChange(appointment._id, e)}
                                            className="border rounded px-2 py-1 mr-2" // Add border to time fields
                                        />
                                        <button onClick={() => handleUpdate(appointment._id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2">Save</button>
                                        <button onClick={() => toggleEdit(appointment._id)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{formatTime(appointment.start_time)} to {formatTime(appointment.end_time)}</span>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <button onClick={() => toggleEdit(appointment._id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">Update</button>
                                        <button onClick={() => deleteAppointment(appointment._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MySchedule;
