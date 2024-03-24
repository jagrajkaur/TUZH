/* @author: Anjani Sukhavasi
   @FileDescription: Implement UI for myTask 
*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './mytask.css'; // Import CSS file

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ description: '', duration: '', status: '', patient_id: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('your-backend-api-url/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      await axios.post('your-backend-api-url/tasks', newTask);
      setNewTask({ description: '', duration: '', status: '', patient_id: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`your-backend-api-url/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`your-backend-api-url/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="task-dashboard">
      <h1>Task Dashboard</h1>
      <div className="add-task">
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Duration"
          value={newTask.duration}
          onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
        />
        <input
          type="text"
          placeholder="Status"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        />
        <input
          type="text"
          placeholder="Patient ID"
          value={newTask.patient_id}
          onChange={(e) => setNewTask({ ...newTask, patient_id: e.target.value })}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div className="task-list">
        <h2>Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Patient ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.task_id}>
                <td>{task.task_id}</td>
                <td>{task.description}</td>
                <td>{task.duration}</td>
                <td>{task.status}</td>
                <td>{task.patient_id}</td>
                <td>
                  <button onClick={() => handleDeleteTask(task.task_id)}>Delete</button>
                  <button onClick={() => handleStatusChange(task.task_id, 'in progress')}>In Progress</button>
                  <button onClick={() => handleStatusChange(task.task_id, 'completed')}>Completed</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskDashboard;
