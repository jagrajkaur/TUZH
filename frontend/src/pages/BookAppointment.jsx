import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../config";

const BookAppointment = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/appointment/getAppointment`);
                // Format the appointment dates and times
                const formattedAppointments = response.data.map(appointment => ({
                    ...appointment,
                    appointmentDate: formatDate(appointment.appointmentDate),
                    startTime: formatTime(appointment.startTime),
                    endTime: formatTime(appointment.endTime)
                }));
                setAppointments(formattedAppointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        return new Date('1970-01-01T' + timeString + 'Z').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    const handleRequestAppointment = async (appointmentId) => {
        try {
            console.log ("---Appointment ID-----");
            console.log(appointmentId);
            const patientId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : '';
            //await axios.put(`${BASE_URL}/appointment/requestAppointment/${appointmentId}/${patientId}`);

            
            await axios.put(`${BASE_URL}/appointment/requestAppointment`, null, {
                params: { appointmentId, patientId } // Pass patient ID as a query parameter
            });
            
            // Update appointments list after request
            const updatedAppointments = appointments.map(appointment => {
                if (appointment._id === appointmentId) {
                    return { ...appointment, status: 'pending', patient_id: patientId };
                }
                return appointment;
            });
            setAppointments(updatedAppointments);
        } catch (error) {
            console.error('Error requesting appointment:', error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold mb-6">Available Appointments</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map(appointment => (
                    <div key={appointment.appointment_id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                        <div className="p-6">
                            <p className="text-lg font-semibold">Appointment Date: {appointment.appointmentDate}</p>
                            <p className="text-lg font-semibold">Doctor Name: {appointment.doctorName}</p>
                            <p className="text-lg">Doctor Speciality: {appointment.doctorSpeciality}</p>
                            <p className="text-lg">Doctor Address: {appointment.doctorAddress}</p>
                            <p className="text-lg">Start Time: {appointment.startTime}</p>
                            <p className="text-lg">End Time: {appointment.endTime}</p>
                            <button onClick={() => handleRequestAppointment(appointment.appointment_id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                                Request Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookAppointment;
