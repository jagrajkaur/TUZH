import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../config";
import { Link } from 'react-router-dom';

const BookAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [hasAppointment, setHasAppointment] = useState(false); // Initialize with false

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/appointment/getAppointment`);
                const formattedAppointments = response.data.map(appointment => ({
                    ...appointment,
                    appointmentDate: formatDate(appointment.appointmentDate),
                    startTime: appointment.startTime,
                    endTime:appointment.endTime
                }));
                const upcomingWeek = getUpcomingWeekDates();
                const filteredAppointments = formattedAppointments.filter(appointment => {
                    const appointmentDate = new Date(appointment.appointmentDate);
                    return upcomingWeek.some(date => isSameDay(date, appointmentDate));
                });
                const sortedAppointments = filteredAppointments.sort((a, b) => {
                    const dateComparison = new Date(a.appointmentDate) - new Date(b.appointmentDate);
                    if (dateComparison === 0) {
                        return a.startTime.localeCompare(b.startTime);
                    }
                    return dateComparison;
                });
                setAppointments(sortedAppointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        const checkExistingAppointment = async () => {
            try {
                const patientId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : '';
                const response = await axios.get(`${BASE_URL}/appointment/getPatientAppointments/${patientId}`);
                setHasAppointment(response.data.length > 0);
            } catch (error) {
                console.error('Error fetching patient appointments:', error);
            }
        };

        fetchAppointments();
        checkExistingAppointment();
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
    

    const handleRequestAppointment = async (appointmentId) => {
        try {
            const patientId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : '';
            const response = await axios.put(`${BASE_URL}/appointment/lockAppointment`, null, {
                params: { appointmentId, patientId }
            });
    
            if (response.data.success) {
                // Appointment successfully locked, proceed with booking
                await axios.put(`${BASE_URL}/appointment/requestAppointment`, null, {
                    params: { appointmentId, patientId }
                });
                const updatedAppointments = appointments.map(appointment => {
                    if (appointment._id === appointmentId) {
                        return { ...appointment, status: 'pending', patient_id: patientId };
                    }
                    return appointment;
                });
                setAppointments(updatedAppointments);
                setHasAppointment(true); // Update hasAppointment to true after booking
            } else {
                // Appointment is already locked, show alert and refresh page
                alert("This appointment is no longer available.");
                window.location.reload();
            }
        } catch (error) {
            if (error.response.status === 409) {
                // Appointment is already locked, show alert and refresh page
                alert("This appointment is no longer available.");
                window.location.reload();
            } else {
                console.error('Error requesting appointment:', error);
            }
        }
    };

    return (
        <div>
            {hasAppointment ? (
                <div className="my-6">
                    <p className="text-xl font-semibold mb-4">You have an appointment in progress.</p>
                    <Link to="/PatientAppointments" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        View My Appointments
                    </Link>
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl font-semibold mb-6">Available Appointments</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointments.map(appointment => (
                            <div key={appointment.appointment_id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                                <div className="bg-gradient-to-b from-blue-300 to-purple-300 p-6">
                                    <p className="text-lg font-semibold">Appointment Date: {appointment.appointmentDate}</p>
                                    <p className="text-lg font-semibold">Doctor Name: {appointment.doctorName}</p>
                                    <p className="text-lg">Doctor Speciality: {appointment.doctorSpeciality}</p>
                                    <p className="text-lg">Doctor Address: {appointment.doctorAddress}</p>
                                    <p className="text-lg">Start Time: {formatTime(appointment.startTime)}</p>
                                    <p className="text-lg">End Time: {formatTime(appointment.endTime)}</p>
                                    <button onClick={() => handleRequestAppointment(appointment.appointment_id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                                        Request Appointment
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookAppointment;
