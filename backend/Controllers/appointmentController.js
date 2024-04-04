import Appointment from '../models/Appointments.js'; 
import User from '../models/User.js';


export const createAppointment = async (req, res) => {
    try {
        const { doctor_id, appointment_date, start_time, end_time } = req.body;

        // Check if there's an existing appointment with the same details
        const existingAppointment = await Appointment.findOne({
            doctor_id,
            appointment_date,
            start_time,
            end_time
        });

        if (existingAppointment) {
            // Send an error response if the appointment already exists
            return res.status(200).json({message: "exists" });
        }

        // If no existing appointment found, create a new one
        const appointment = new Appointment({
            doctor_id,
            appointment_date,
            start_time,
            end_time,
        });
        await appointment.save();
        res.status(200).json({ success:true, message: "success" });
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

export const fetchAppointmentsByDoctor  = async (req, res) => {
    try {
        // Find all appointments by the doctorId
        const appointments = await Appointment.find({ doctor_id: req.params.id });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const removeAppointment = async (req, res) => {
    try {
        // Find the appointment by id and delete it
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getPendingAppointments = async (req, res) => {
    const  doctorId  = req.params.id;
    try {
        // Find all appointments for the doctor with status 'pending'
        const appointments = await Appointment.find({ doctor_id: doctorId, status: 'pending' });

        // Map through appointments and populate patient email
        const populatedAppointments = await Promise.all(appointments.map(async appointment => {
            const patient = await User.findById(appointment.patient_id);
            const patientEmail = patient.email;
            return { ...appointment.toObject(), patientEmail };
        }));

        res.json(populatedAppointments);
    } catch (error) {
        console.error('Error fetching pending appointments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const acceptRequest = async (req, res) => {
    const  appointmentId  = req.params.id;

    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);

        // If appointment is not found or already accepted/rejected, return error
        if (!appointment || appointment.status !== 'pending') {
            return res.status(404).json({ error: 'Appointment not found or already processed' });
        }

        // Update the status to 'accepted'
        appointment.status = 'booked';

        // Save the updated appointment
        await appointment.save();

        res.json({ message: 'Appointment request accepted successfully' });
    } catch (error) {
        console.error('Error accepting appointment request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const rejectRequest = async (req, res) => {
    const  appointmentId  = req.params.id;

    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);

        // If appointment is not found or already accepted/rejected, return error
        if (!appointment || appointment.status !== 'pending') {
            return res.status(404).json({ error: 'Appointment not found or already processed' });
        }

        // Update the status to 'accepted'
        appointment.status = 'cancelled';

        // Save the updated appointment
        await appointment.save();

        res.json({ message: 'Appointment request cancelled' });
    } catch (error) {
        console.error('Error accepting appointment request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getPatientAppointments = async (req, res) => {
    try {

        const  patientId  = req.params.id;
        // Check if there is any appointment with the given patient_id and status is not cancelled
        const appointment = await Appointment.findOne({ patient_id: patientId, status: { $in: ['booked', 'pending'] }});
        
        if (appointment) {
            // Patient has an appointment already
            res.json({ length: 1, appointment });
        } else {
            // Patient does not have any active appointment
            res.json({ length:0 });
        }
    } catch (error) {
        console.error('Error checking appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getAppointmentsWithDoctorDetails = async (req, res) => {
    try {
        const patientId = req.params.id;
        const appointments = await Appointment.find({ patient_id: patientId, status: { $ne: 'new' } }).exec();

        // Map through appointments to fetch doctor details for each appointment
        const appointmentsWithDoctor = await Promise.all(appointments.map(async appointment => {
            const doctorID = appointment.doctor_id;
            const doctorDetails = await User.findOne({ _id: doctorID, user_type: "Doctor" })
                .select('first_name last_name address speciality');

            return {
                _id: appointment._id,
                appointment_date: appointment.appointment_date,
                doctorName: `${doctorDetails.first_name} ${doctorDetails.last_name}`,
                doctorSpeciality: doctorDetails.speciality,
                doctorAddress: doctorDetails.address,
                start_time: appointment.start_time,
                end_time: appointment.end_time,
                status: appointment.status
            };
        }));

        res.json({ appointments: appointmentsWithDoctor });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const lockAppointment = async (req, res) => {
    const { appointmentId, patientId } = req.query;
    try {
        // Check if the appointment is already locked
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        
        if (appointment.is_locked) {
            // Appointment is already locked, return failure response
            return res.status(409).json({ success: false, message: 'Appointment is already locked' });
        }

        // Lock the appointment
        appointment.is_locked = true;
        await appointment.save();

        // Return success response
        return res.status(200).json({ success: true, message: 'Appointment locked successfully' });
    } catch (error) {
        console.error('Error locking appointment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const cancelAppointment = async (req, res) => { 
    const appointmentId  = req.params.id;

    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Update appointment details
        appointment.status = 'new'; // Change status to "new"
        appointment.patient_id = null; // Remove patient_id
        appointment.is_locked = false; // Remove is_locked
        appointment.version = 0; // Remove version

        // Save the updated appointment
        await appointment.save();

        // Return success response
        return res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const markComplete = async (req, res) => { 
    try {
        const appointmentId = req.params.id;
        // Update the status of the appointment to "completed"
        await Appointment.findByIdAndUpdate(
            appointmentId,
            { $set: { status: 'completed' } }
        );
        res.status(200).json({ success: true, message: 'Appointment marked as completed' });
    } catch (error) {
        console.error('Error marking appointment as completed:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


export const updateAppointment = async (req, res) => {
    const  id  = req.params.id;
    const { start_time, end_time } = req.body;
    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Update the appointment
        appointment.start_time = start_time;
        appointment.end_time = end_time;

        // Save the updated appointment
        await appointment.save();

        res.json({ message: 'Appointment updated successfully', appointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};