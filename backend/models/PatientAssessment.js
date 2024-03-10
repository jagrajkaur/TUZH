import mongoose, { Schema } from "mongoose";

/* @author: Jagraj Kaur
   @FileDescription: Implement patient assesment schema for managing patient's responses to questions
*/

const patientAssessmentSchema = new mongoose.Schema({
    patient_id: { type: Schema.Types.ObjectId, ref: 'User' },
    assessment_response: { type: Schema.Types.Mixed },     // storing responses as JSON
    assessment_timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("PatientAssessment", patientAssessmentSchema);