import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema({
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    patient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    is_predefined: {type: Boolean,default:false} //new field to indicate if the task is predefined or custom
});

export default mongoose.model("mytasks", taskSchema);
