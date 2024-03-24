import Appointment from '../models/Appointments.js'; 

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