// admin.js

import express from "express";
import { approveUser, rejectUser, getPendingDoctors } from "../Controllers/adminController.js";

const router = express.Router();

// Routes for approving and rejecting users
router.put('/users/:userId/approve', approveUser);
router.put('/users/:userId/reject', rejectUser);

// Route for getting pending doctors
router.get('/pending-doctors', getPendingDoctors);

export default router;
