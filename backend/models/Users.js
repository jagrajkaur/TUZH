import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, minlength: [3, 'First name must be at least 3 characters long'] },
    last_name: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user_type: { 
        type: String, 
        enum: ['Doctor', 'Patient', 'Admin'], 
        required: true 
    },
    speciality: { type: String } // Only applicable for user_type 'Doctor'
});

export default mongoose.model("User", userSchema);
