import express from "express";
import { createAppointment, getAppointments, getAppointmentsWithDoctorDetails, getPatientAppointments, requestAppointment, removeAppointment, fetchAppointmentsByDoctor, getPendingAppointments, acceptRequest, rejectRequest} from "../Controllers/appointmentController.js";

const router = express.Router();


router.post('/createAppointment', createAppointment);
router.get('/getAppointment', getAppointments);
router.put('/requestAppointment', requestAppointment);
router.delete('/deleteAppointment/:id', removeAppointment);
router.get('/fetch/:id', fetchAppointmentsByDoctor);
router.get('/getPendingAppointments/:id', getPendingAppointments);
router.put('/acceptRequest/:id', acceptRequest);
router.put('/rejectRequest/:id', rejectRequest);
router.get('/getPatientAppointments/:id', getPatientAppointments);
router.get('/getMyAppointment/:id', getAppointmentsWithDoctorDetails)

export default router;