import mongoose from "mongoose";

/* @author: Jagraj Kaur
   @FileDescription: Implement user schema for managing database fields for both doctors and patients
*/

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
    speciality: { type: String, required: function(){
        return this.user_type === 'Doctor';     // Only required if user_type is 'Doctor'
    }},
    isApproved: {
        type: String,
        enum: ["Pending", "Approved", "Cancelled"],
        default: function(){
            return this.user_type === 'Doctor' ? "Pending" : undefined;   // Default value only if user_type is 'Doctor'
        },
        required: function(){
            return this.user_type === 'Doctor';     // Only required if user_type is 'Doctor'
        }
    }
});

export default mongoose.model("User", userSchema);
