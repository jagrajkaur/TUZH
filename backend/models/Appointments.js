import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appointment_date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    status: { type: String, enum: ['new', 'pending', 'booked', 'cancelled'], default: 'new' }
});

export default mongoose.model('Appointment', appointmentSchema);
