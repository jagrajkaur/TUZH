import express from "express";
import { createAppointment, getAppointments, requestAppointment} from "../Controllers/appointmentController.js";
const router = express.Router();


router.post('/createAppointment', createAppointment);
router.get('/getAppointment', getAppointments);
router.put('/requestAppointment', requestAppointment);

export default router;