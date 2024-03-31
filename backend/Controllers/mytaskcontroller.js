import User from '../models/User.js';
import mytasks from '../models/mytasks.js';
import Task from '../models/mytasks.js';
import redisClient from '../redis.js';

// Controller function to create a new task
export const createTask = async (req, res) => {
  try {
    const { description, duration, patient_id } = req.body;
    
    //check if patient Id is not defined
    if(!patient_id){
      return res.status(400).json({ success: false, message: "Patient ID is required" });
    }

    // Check if the patient exists in the database
    const existingPatient = await User.findById(patient_id);
    if(!existingPatient) {
        return res.status(404).json({ success:false, message: "Patient not found with the provided ID" });
    }

    //create new task
    const newTask = new Task({ description, duration, patient_id });

    //save the task to MongoDB
    await newTask.save();

    // Check if task list is cached in Redis
    const cachedData = await redisClient.get(`myTasks:${patient_id}`);
    if (cachedData) {
        const myTasks = JSON.parse(cachedData);
        myTasks.push(newTask); // Add the new task to the existing list

        //update the task list in the cache
        await redisClient.set(`myTasks:${patient_id}`, JSON.stringify(myTasks), 'EX', 3600);

        return res.status(200).json({ success: true, data: myTasks, message: "Custom task created and cached" });
    }

    // If not cached, fetch task list from MongoDB
    const myTasks = await Task.find({ patient_id: patient_id });
    if (!myTasks || myTasks.length === 0) {
        return res.status(404).json({ success: false, message: "No task found for the patient" });
    }

    // Cache the updated task list in Redis
    await redisClient.set(`myTasks:${patient_id}`, JSON.stringify(myTasks), 'EX', 3600);

    res.status(200).json({ success: true, data: myTasks, message: "Custom task created and cached" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error, please try again" });
  }
};

// Controller function to get all tasks by the patient ID
export const getAllTasks = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    
    // Check if patient ID is not defined
    if (!patientId) {
      return res.status(400).json({ success: false, message: "Patient ID is required" });
    }

    // Check if the patient exists in the database
    const existingPatient = await User.findById(patientId);
    if(!existingPatient) {
        return res.status(404).json({ success:false, message: "Patient not found with the provided ID" });
    }
 
    // check if task list cached in Redis
    const cachedData = await redisClient.get(`myTasks:${patientId}`);
    if(cachedData) {
      const myTasks = JSON.parse(cachedData);
      return res.status(200).json({ success:true, data: myTasks, message: "My Tasks retrieved from cache" });
    }
    
    //If not cached, fetch my tasks like from MongoDB
    const myTasks = await Task.find({ patient_id: patientId });
    if(!myTasks || myTasks.length === 0) {
      return res.status(404).json({ success:false, message:"No task found for the patient" });
    }

    //Cache the task list in Redis with an expiration time (e.g., 1 hour)
    await redisClient.set(`myTasks:${patientId}`, JSON.stringify(myTasks), 'EX', 3600);

    res.status(200).json({ success:true, data: mytasks, message:"Tasks list fetchd from the database" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success:false, message: "Internal server error, please try again" });
  }
};

// Controller function to get a task by ID
export const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;

     // Check if task ID is not defined
     if (!taskId) {
      return res.status(400).json({ success: false, message: "Task ID is required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success:false, message: 'Task not found' });
    }

    //Cache the task details in Redis with a specific key (e.g., task ID)
    await redisClient.set(`cachedTask:${taskId}`, JSON.stringify(task), 'EX', 3600); // Cache for 1 hour

    res.status(200).json({success:true,  data:task, message:"Task retrieved from the database" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error, please try again" });
  }
};

// Controller function to update a task
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updatedTaskData = req.body;
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove the cached task from Redis
    await redisClient.del(`cachedTask:${taskId}`);

    res.status(200).json({ success:true, message:"Successfully updated", data:updatedTask });
  } catch (error) {
    res.status(500).json({ success:false, message: "Failed to update" });
  }
};

// Controller function to save predefined tasks in database
export const savePredefinedTasks = async (userId, { session }) => {   //Accept session as an argument
  try {
    /* Define predefined tasks */
    const predefinedTasks = [
      {
        description: 'Record your mood each day using a scale of 1 to 10, with 1 being the worst and 10 being the best.',
        duration: 5,
        is_predefined: true,
        patient_id: userId
      },
      {
        description: 'Practice mindfulness meditation for 15 minutes every morning.',
        duration: 15,
        is_predefined: true,
        patient_id: userId
      },
      {
        description: 'Engage in physical activity (e.g., walking, yoga, dancing) for at least 30 minutes each day.',
        duration: 30,
        is_predefined: true,
        patient_id: userId
      },
      {
        description: 'Connect with a friend or family member for a meaningful conversation or activity at least once a week.',
        duration: 10,
        is_predefined: true,
        patient_id: userId
      },
      {
        description: 'Write in your journal for 10 minutes before bed, focusing on your thoughts and feelings.',
        duration: 10,
        is_predefined: true,
        patient_id: userId
      }
    ];

    // Save predefined tasks to the database within the transaction context
    const savedTask = await Task.insertMany(predefinedTasks, { session });
    return savedTask;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};
  