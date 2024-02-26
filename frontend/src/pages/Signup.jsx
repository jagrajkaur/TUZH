import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sideImg from "../assets/images/regSide.png";

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerAs, setRegisterAs] = useState('');
  const [qualification, setQualification] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      firstName,
      lastName,
      age,
      gender,
      address,
      email,
      password,
      confirmPassword,
      registerAs,
      qualification,
    });
    // Reset form fields
    setFirstName('');
    setLastName('');
    setAge('');
    setGender('');
    setAddress('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRegisterAs('');
    setQualification('');
  };

  const registerOptions = ['Patient', 'Doctor'];
  const qualificationOptions = ['MD', 'PhD', 'MBBS', 'MS', 'DM'];

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 ">
      <div className="max-w-screen-xl flex flex-col lg:flex-row mx-4 lg:mx-auto rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: "#FFF5DF" }}>
        {/* Image Section */}
        <div className="lg:w-1/2">
          <img src={sideImg} alt="Login Image" className="w-full h-full object-cover" />
          </div>
        

        {/* Form Section */}
        <div className="lg:w-1/2 p-8">
          <h2 className="text-3xl font-semibold mb-4">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block font-semibold">First Name:</label>
              <input
                type="text"
                id="firstName"
                className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block font-semibold">Last Name:</label>
              <input
                type="text"
                id="lastName"
                className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="age" className="block font-semibold">Age:</label>
              <input
                type="number"
                id="age"
                className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="space-x-4">
              <span className="block font-semibold">Gender:</span>
              <div className="flex items-center">
                <label htmlFor="male" className="mr-2">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="mr-1"
                    required
                  /> Male
                </label>
                <label htmlFor="female">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="mr-1"
                    required
                  /> Female
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block font-semibold">Address:</label>
              <textarea
                id="address"
                className="form-textarea block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-semibold">Email:</label>
              <input
                type="email"
                id="email"
                className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md"
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
                className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block font-semibold">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="registerAs" className="block font-semibold">Register as:</label>
              <select
                id="registerAs"
                className="form-select block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={registerAs}
                onChange={(e) => setRegisterAs(e.target.value)}
                required
              >
                <option value="">Select Option</option>
                {registerOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
            {registerAs === 'Doctor' && (
              <div>
                <label htmlFor="qualification" className="block font-semibold">Qualification:</label>
                <select
                  id="qualification"
                  className="form-select block w-full border-gray-300 rounded-md"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required
                >
                  <option value="">Select Qualification</option>
                  {qualificationOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}
            <button type="submit" className="btn-primary w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md">Register</button>
          </form>
          <div className="flex justify-between mt-4">
            <Link to="/login" className="text-blue-500 hover:underline">Already have an account? Login</Link>
          </div>
        </div>
        
        

      </div>
    </div>
  );
};

export default Signup;
