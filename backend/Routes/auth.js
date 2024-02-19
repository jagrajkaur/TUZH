import express from "express";
import {register, login} from "../Controllers/authController.js";

const router = express.Router();

console.log("==Inside auth.js file==");
router.post("/register", register);
router.post("/login", login);

export default router;