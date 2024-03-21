import mongoose, { Schema } from "mongoose";

/* @author: Jagraj Kaur
   @FileDescription: Implement patient assesment schema for managing patient's responses to questions
*/

const patientAssessmentSchema = new mongoose.Schema({
    patient_id: { type: Schema.Types.ObjectId, ref: 'User' },
    assessment_response: { type: Schema.Types.Mixed, required: true },     // storing responses as JSON Example {"question": "test", "selectedAnswer": "NOT AT ALL", "score":"0"}
    total_score: { type: Number, required: true },
    depression_type: {
        type: String,
        enum: ['Minimal', 'Mild', 'Moderate', 'Moderately severe', 'Severe'],
        required: true
    },
    assessment_timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("PatientAssessment", patientAssessmentSchema);