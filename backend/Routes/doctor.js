import express from "express";
import { createAppointment} from "../Controllers/doctorController.js";
const router = express.Router();

// Routes for approving and rejecting users
router.post('/createAppointment', createAppointment);

export default router;