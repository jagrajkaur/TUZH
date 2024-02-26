import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md bg-blue-50">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-semibold">Email:</label>
              <input
                type="email"
                id="email"
                className="form-input block w-full border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-semibold">Password:</label>
              <input
                type="password"
                id="password"
                className="form-input block w-full border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-2 bg-blue-500 text-white font-semibold rounded-md">Login</button>
          </div>
        </form>
        <div className="flex justify-between mt-4">
          <Link to="/register" className="text-blue-500 hover:underline">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
