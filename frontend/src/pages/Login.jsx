import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sideImg from "../assets/images/side.jpg";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    setEmail('');
    setPassword('');
  };

  const validateEmail = (email) => {
    // Regular expression for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 ">
      <div className="max-w-screen-lg m-20 flex lg:flex-row mx-4 lg:mx-auto rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: "#CBF0F3" }}>
        
        {/* Form Section */}
        <div className="lg:w-1/2 p-8 overflow-y-auto">
          <h2 className="text-3xl font-semibold mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+" // Pattern for email validation
              title="Please enter a valid email address"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full py-2 bg-blue-500 text-white font-semibold rounded-md">Login</button>
          </form>
          <div className="flex justify-between mt-4">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
            <Link to="/register" className="text-blue-500 hover:underline">Don't have an account? Register</Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2">
          <img src={sideImg} alt="Login Image" className="w-full h-full object-cover" />
        </div>

      </div>
    </div>
  );
};

export default Login;
