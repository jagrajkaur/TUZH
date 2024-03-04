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
      <div className="max-w-screen-lg m-20 flex lg:flex-row mx-4 lg:mx-auto rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: "#FFF5DF" }}>
        {/* Image Section */}
        <div className="lg:w-1/2">
          <img src={sideImg} alt="Login Image" className="w-full h-full object-cover" />
          </div>
        

        {/* Form Section */}
<div className="lg:w-1/2 p-8 overflow-y-auto">
  <h2 className="text-3xl font-semibold mb-4">Sign Up</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="flex space-x-4">
      <input
        type="text"
        placeholder="First Name"
        className="form-input block w-1/2 px-4 py-2 border border-gray-300 rounded-md text-base"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        className="form-input block w-1/2 px-4 py-2 border border-gray-300 rounded-md text-base"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
    </div>
    <div className="flex space-x-4">
      <input
        type="number"
        placeholder="Age"
        className="form-input block w-1/2 px-4 py-2 border border-gray-300 rounded-md text-base"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <select
        placeholder="Gender"
        className="form-select block w-1/2 px-4 py-2 border border-gray-300 rounded-md text-base"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
      >
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
    <input
      type="text"
      placeholder="Address"
      className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      required
    />
    <input
      type="email"
      placeholder="Email"
      className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <input
      type="password"
      placeholder="Password"
      className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <input
      type="password"
      placeholder="Confirm Password"
      className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
    <select
      placeholder="Register As"
      className="form-select block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
      value={registerAs}
      onChange={(e) => setRegisterAs(e.target.value)}
      required
    >
      <option value="">Register As</option>
      {registerOptions.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
    {registerAs === 'Doctor' && (
      <select
        placeholder="Qualification"
        className="form-select block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
        value={qualification}
        onChange={(e) => setQualification(e.target.value)}
        required
      >
        <option value="">Qualification</option>
        {qualificationOptions.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
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
