import Task from '../models/mytasks.js';

// Controller function to create a new task
export const createTask = async (req, res) => {
  try {
    const { description, duration, status, patient_id } = req.body;
    const newTask = new Task({ description, duration, status, patient_id });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all tasks
export const getAllTasks = async (req, res) => {
    console.log("inside get all task method");
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Controller function to get a task by ID
export const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to seed the database with predefined tasks
export const seedPredefinedTasks = async (req, res) => {
    try {
      const predefinedTasks = [
        {
          description: 'Record your mood each day using a scale of 1 to 10, with 1 being the worst and 10 being the best.',
          duration: 5,
          is_predefined: true
        },
        {
          description: 'Practice mindfulness meditation for 15 minutes every morning.',
          duration: 15,
          is_predefined: true
        },
        {
          description: 'Engage in physical activity (e.g., walking, yoga, dancing) for at least 30 minutes each day.',
          duration: 30,
          is_predefined: true
        },
        {
          description: 'Connect with a friend or family member for a meaningful conversation or activity at least once a week.',
          duration: 10,
          is_predefined: true
        },
        {
          description: 'Write in your journal for 10 minutes before bed, focusing on your thoughts and feelings.',
          duration: 10,
          is_predefined: true
        }
      ];
  
      // Insert predefined tasks
      //await Task.insertMany(predefinedTasks);

      for (const taskData of predefinedTasks) {
        const newTask = new Task(taskData);
        await newTask.save();
      }
  
      res.status(201).json({ message: 'Predefined tasks added successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  