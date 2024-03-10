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

        const newAssesment = new PatientAssessment({
            patient_id,
            assessment_response
        });

        const savedAssesment = await newAssesment.save();
        res.status(200).json({ success:true, message: "Assesment successfully saved", savedAssesment });
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
