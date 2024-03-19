import PatientAssessment from "../models/PatientAssessment.js";
import User from '../models/User.js';

/* @author: Jagraj Kaur
   @FileDescription: Implemented function to save and fetch patient's assesment responses from the database.
*/

/* To save assesment responses for patient */
export const savePatientAssessment = async(req,res)=>{
    try {
        const { patient_id, assessment_response } = req.body;

        // Validate incoming data
        if (!patient_id || !assessment_response) {
            return res.status(400).json({ success: false, message: "Invalid data" });
        }

        // Check if the patient exists in the database
        const existingPatient = await User.findById(patient_id);
        if(!existingPatient) {
            return res.status(404).json({ success:false, message: "Patient not found" });
        }

        // Calculate the total score and determine the depression type
        /*  The reduce method is used to iterate over the assessment_response array and accumulate a single value, which in this case is the total score of the assessment.
            The paramteres (acc, response) represent the accumulator('acc') and the current element being processed('response') in each iteration of the array. 
        */
        const total_score = assessment_response.reduce((acc, response) => {
            if (typeof response.score !== 'number') {
                throw new Error('Invalid data type for score');
            }
            return acc + response.score;
        }, 0);  // Initialize accumulator with 0

        let depression_type;
        if (total_score >= 1 && total_score <= 4) {
            depression_type = 'Minimal';
        } else if (total_score >= 5 && total_score <= 9){
            depression_type = 'Mild';
        } else if (total_score >= 10 && total_score <= 14){
            depression_type = 'Moderate';
        } else if (total_score >= 15 && total_score <= 19){
            depression_type = 'Moderately severe';
        } else {
            depression_type = 'Severe';
        }

        const newAssesment = new PatientAssessment({
            patient_id,
            assessment_response,
            total_score,
            depression_type
        });

        const savedAssesment = await newAssesment.save();
        res.status(200).json({ success:true, message: "Assesment response saved successfully", savedAssesment });
    } catch(err){
        console.log(err.message);
        res.status(500).json({ success:false, message: "Internal server error, please try again" });
    }
}

/* To get the assesment response by pateint ID */
export const fetchPatientAssessment = async(req,res)=>{
    try{
        const assessmentResponses = await PatientAssessment.find({ patient_id: req.params.patientId });
        if (!assessmentResponses) {
            return res.status(404).json({ success: false, message: "No assessment responses found for the patient" });
        }
        
        res.status(200).json({ success:true, data: assessmentResponses });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success:false, message: "Internal server error, please try again" });
    }
}
