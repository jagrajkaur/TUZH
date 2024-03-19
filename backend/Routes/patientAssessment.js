import express from "express";
import { savePatientAssessment, fetchPatientAssessment } from "../Controllers/patientAssessmentController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.post("/", authenticate, restrict(["Patient"]), savePatientAssessment);
router.get("/:patientId", authenticate, restrict(["Patient"]), fetchPatientAssessment);

export default router;