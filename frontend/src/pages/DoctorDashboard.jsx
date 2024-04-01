import React from 'react';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
    return (
        <div className="flex flex-col gap-8 justify-center items-center bottom-5 right-5">
            <div className="flex flex-row gap-8">
                <div className="m-2">
                    <Link to="/doctor/addAvailablity" className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none flex flex-col justify-center items-center w-32 h-32 px-20 py-4">
                        <h3 className="text-lg font-semibold mb-2">Add Availability</h3>
                    </Link>
                </div>
                <div className="m-2">
                    <Link to="/doctor/myAvailability" className="bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg shadow-md hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none flex flex-col justify-center items-center w-32 h-32 px-20 py-4">
                        <h3 className="text-lg font-semibold mb-2">My Availabilities</h3>
                    </Link>
                </div>
            </div>
            <div className="flex flex-row gap-8">
                <div className="m-2">
                    <Link to="/doctor/pendingRequests" className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-md hover:bg-purple-600 focus:bg-purple-600 focus:outline-none flex flex-col justify-center items-center w-32 h-32 px-20 py-4">
                        <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
                    </Link>
                </div>
                <div className="m-2">
                    <Link to="/doctor/myAppointments" className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-md hover:bg-red-600 focus:bg-red-600 focus:outline-none flex flex-col justify-center items-center w-32 h-32 px-20 py-4">
                        <h3 className="text-lg font-semibold mb-2">My Appointments</h3>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
