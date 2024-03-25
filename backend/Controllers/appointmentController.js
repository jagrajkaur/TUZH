import Appointment from '../models/Appointments.js'; 
import User from '../models/User.js';
export const createAppointment = async (req, res) => {
    try {
        const { doctor_id, appointment_date, start_time, end_time } = req.body;
        const appointment = new Appointment({
            doctor_id,
            appointment_date,
            start_time,
            end_time,
        });
        await appointment.save();
        res.status(200).json({ success:true, message: "New Availability Added successfully" });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Failed to create appointment' });
    }
}

export const getAppointments = async (req, res) => {
    try {
        // Fetch appointments
        const appointments = await Appointment.find({ status: 'new' });

        // If no appointments found, return empty array
        if (!appointments) {
            return res.status(200).json([]);
        }

        // Iterate over each appointment to fetch associated doctor details
        const appointmentsWithDoctorDetails = await Promise.all(appointments.map(async appointment => {
            // Fetch doctor details using doctor_id from the appointment
            const doctorDetails = await User.findOne({ _id: appointment.doctor_id, user_type: 'Doctor' })
                .select('first_name last_name speciality address');

            // Combine appointment and doctor details
            const appointmentWithDoctor = {
                appointment_id: appointment._id,
                appointmentDate: appointment.appointment_date,
                doctorName: `${doctorDetails.first_name} ${doctorDetails.last_name}`,
                doctorSpeciality: doctorDetails.speciality,
                doctorAddress: doctorDetails.address,
                startTime: appointment.start_time,
                endTime: appointment.end_time
            };
            return appointmentWithDoctor;
        }));

        res.status(200).json(appointmentsWithDoctorDetails);
    } catch (error) {
        console.error('Error fetching appointments with doctor details:', error);
        res.status(500).json({ message: 'Failed to fetch appointments with doctor details' });
    }
}

export const requestAppointment = async (req, res) => {
    const { appointmentId, patientId} = req.query;
    console.log (appointmentId);
    console.log (patientId);
    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Update appointment status and add patient ID
        appointment.status = 'pending';
        appointment.patient_id = patientId;
        await appointment.save();

        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error requesting appointment:', error);
        res.status(500).json({ message: 'Failed to request appointment' });
    }
}

