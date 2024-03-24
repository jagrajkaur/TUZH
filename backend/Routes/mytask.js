import express from 'express';
import * as taskController from '../Controllers/mytaskcontroller.js';
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

// Route to create a new task
router.post('/',authenticate, restrict(["Patient"]), taskController.createTask);

// Route to get all tasks
router.get('/',authenticate, restrict(["Patient"]) ,taskController.getAllTasks);

// Route to get a task by ID
router.get('/:taskId', taskController.getTaskById);

// Route to update a task by ID
router.put('/:taskId', taskController.updateTask);

// Route to seed the database with predefined tasks
router.post('/seed', taskController.seedPredefinedTasks);

// Route to delete a task by ID
//router.delete('/tasks/:taskId', taskController.deleteTask);

export default router;
