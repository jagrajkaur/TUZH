import express from "express";
import {updateUser, deleteUser, getAllUser, getSingleUser} from "../Controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/:id", authenticate, restrict(["Doctor", "Patient"]), getSingleUser);
router.get("/", authenticate, restrict(["Admin"]), getAllUser);
router.put("/:id", authenticate, restrict(["Doctor", "Patient"]), updateUser);
router.delete("/:id", authenticate, restrict(["Doctor", "Patient"]), deleteUser);

export default router;