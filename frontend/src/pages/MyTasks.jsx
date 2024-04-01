import { useContext, useEffect, useState } from 'react';
import '../styles/myTask.css';
import { BASE_URL } from '../config';
import { authContext } from '../context/AuthContext';
import { toast } from "react-toastify";

/* @author: Jagraj Kaur
   @FileDescription: To render the MyTasks component for logged in users (Patients)
*/

const MyTasks = () => {
    const { user, token } = useContext(authContext);
    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDuration, setNewTaskDuration] = useState('');
    const [editTaskId, setEditTaskId] = useState('');
    const [editTaskName, setEditTaskName] = useState('');
    const [editTaskDuration, setEditTaskDuration] = useState('');
    const [editTaskStatus, setEditTaskStatus] = useState('');

    // Fetch task lists based on the user ID
    const fetchTasks = async () => {
        try {
            const response = await fetch(`${BASE_URL}/mytask/patient/${user._id}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            
            const responseData = await response.json();
            setTasks(responseData.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user._id, token]);
    
    // Function to handle adding a new task
    const handleAddTask = async () => {
        try {
            const response = await fetch(`${BASE_URL}/mytask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    patient_id: user._id,
                    description: newTaskName,
                    duration: newTaskDuration
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            const result = await response.json();
            toast.success(result.message);

            // Refresh the task list after adding the task
            fetchTasks();
            setNewTaskName('');
            setNewTaskDuration('');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    // Function to handle updating task details
    const handleUpdateTask = async () => {
        const updatedTask = {
            description: editTaskName,
            duration: editTaskDuration,
            status: editTaskStatus
        };

        try {
            const response = await fetch(`${BASE_URL}/mytask/${editTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedTask)
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            const result = await response.json();
            toast.success(result.message);

            // Update the task list after a successful update
            const updatedTasks = tasks.map(task =>
                task._id === editTaskId ? { ...task, ...updatedTask } : task
            );
            setTasks(updatedTasks);

            // Reset edit mode and fields
            setEditTaskId('');
            setEditTaskName('');
            setEditTaskDuration('');
            setEditTaskStatus('');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const toggleEditTask = (taskId, taskName, taskDuration, taskStatus) => {
        setEditTaskId(taskId);
        setEditTaskName(taskName);
        setEditTaskDuration(taskDuration);
        setEditTaskStatus(taskStatus);
    };

    return (
        <div id="myTask_container" className="wrap wide">
            <div className="inner mx-auto bg-[#e3f8f8] rounded-r-3xl rounded-bl-[1.5rem]">
            <header className="flex justify-between items-center mb-6">
                <h1 className="font-semibold">
                    Organize & Manage your tasks with <span className="text-[#ff914d]">TUZH</span>
                </h1>
            </header>
            
            <div className="flex space-x-4">
                <div className="flex flex-row items-center space-x-4">
                    <div className="w-96 flex-1">
                        <input 
                            aria-label="Enter a new task" 
                            placeholder="Enter a new task" 
                            type="text"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="w-50">
                        <input 
                            aria-label="Enter task duration" 
                            placeholder="Duration (minutes)" 
                            type="number" 
                            value={newTaskDuration}
                            onChange={(e) => setNewTaskDuration(e.target.value)}
                            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500 w-full"
                        />
                    </div>
                    <button className="btn mt-0 bg-[#ff914d] text-white" onClick={handleAddTask}>Add task</button>
                </div>
            </div>

            {/* Task List */}
            <div className="grid w-full divide-y divide-gray-200 dark:divide-gray-800">
                {Array.isArray(tasks) && tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <div key={index} className="flex flex-row items-center p-4 gap-4">
                            <span className="font-medium text-gray-500 dark:text-gray-400">{index + 1}.</span>
                            {editTaskId === task._id ? (
                                <div className="flex flex-row items-center space-x-4">
                                    <input 
                                        type="text"
                                        value={editTaskName}
                                        onChange={(e) => setEditTaskName(e.target.value)}
                                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                    <input 
                                        type="number"
                                        value={editTaskDuration}
                                        onChange={(e) => setEditTaskDuration(e.target.value)}
                                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                    <select
                                        value={editTaskStatus}
                                        onChange={(e) => setEditTaskStatus(e.target.value)}
                                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleUpdateTask}>
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <label className={`${task.status === 'Completed' ? 'line-through' : ''} font-medium text-gray-500 dark:text-gray-400`} htmlFor={`task${index}`}>
                                        {task.description}
                                    </label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Duration in Minutes: {task.duration}
                                        <span className={`inline-block ml-2 px-2 py-1 rounded-md text-sm ${task.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                            {task.status}
                                        </span>
                                    </p>
                                </div>
                            )}
                            <div className="flex items-center ml-auto space-x-2">
                                <button className="bg-[#ff914d] text-white px-4 py-2 rounded-lg" onClick={() => toggleEditTask(task._id, task.description, task.duration, task.status)}>
                                    Update
                                </button>
                                {/* <button className="bg-red-500 text-white px-4 py-2 rounded-lg" size="sm">
                                    Delete
                                </button> */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tasks available</p>
                )}
            </div>

            </div>
        </div>
    );
};

export default MyTasks;