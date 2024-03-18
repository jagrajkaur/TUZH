import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/admin/pending-doctors');
      setPendingDoctors(response.data);
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/admin/users/${userId}/approve`);
      // Assuming you want to update the UI after approval, you may re-fetch the pending doctors list
      fetchPendingDoctors();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/admin/users/${userId}/reject`);
      // Assuming you want to update the UI after rejection, you may re-fetch the pending doctors list
      fetchPendingDoctors();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faUser} className="mr-2 text-xl text-gray-600" />
        <p className="text-xl">Welcome</p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Pending Doctors</h2>
      <ul>
        {pendingDoctors.map((doctor) => (
          <li key={doctor._id} className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-lg font-semibold">{doctor.first_name} {doctor.last_name}</p>
              <p className="text-gray-600">{doctor.speciality}</p>
            </div>
            <div>
              <button onClick={() => handleApprove(doctor._id)} className="bg-green-500 text-white px-4 py-2 mr-2 rounded hover:bg-green-600">Accept</button>
              <button onClick={() => handleReject(doctor._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
