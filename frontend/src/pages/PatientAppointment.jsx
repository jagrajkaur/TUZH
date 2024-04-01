import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../config";

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const patientId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : '';
                const response = await axios.get(`${BASE_URL}/appointment/getMyAppointment/${patientId}`);
                setAppointments(response.data.appointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    const cancelAppointment = async (appointmentId) => {
        try {
            await axios.put(`${BASE_URL}/appointment/cancelAppointment/${appointmentId}`);
            // After cancellation, show alert and navigate to the book appointment page
            alert("Appointment has been cancelled. You need to book a new one. You will be redirected to the Book Appointments Page.");
            navigate('/bookappointment');
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        return new Date('1970-01-01T' + timeString + 'Z').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    const getStatusColor = (status) => {
        if (status === 'pending') {
            return 'text-red-500'; // Red color for pending status
        } else if (status === 'booked') {
            return 'text-green-500'; // Green color for booked status
        } else {
            return ''; // Default color
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold mb-6">My Appointments</h1>
            <table className="table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Appointment Date</th>
                        <th className="px-4 py-2">Start Time</th>
                        <th className="px-4 py-2">End Time</th>
                        <th className="px-4 py-2">Doctor Name</th>
                        <th className="px-4 py-2">Address</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(appointment => (
                        <tr key={appointment._id}>
                            <td className="border px-4 py-2">{formatDate(appointment.appointment_date)}</td>
                            <td className="border px-4 py-2">{formatTime(appointment.start_time)}</td>
                            <td className="border px-4 py-2">{formatTime(appointment.end_time)}</td>
                            <td className="border px-4 py-2">{appointment.doctorName}</td>
                            <td className="border px-4 py-2">{appointment.doctorAddress}</td>
                            <td className={`border px-4 py-2 ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                            </td>
                            <td className="border px-4 py-2">
                                {appointment.status === 'pending' && (
                                    <button onClick={() => cancelAppointment(appointment._id)} className="text-red-500 font-semibold">
                                        Cancel
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientAppointments;
