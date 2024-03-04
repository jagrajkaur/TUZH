import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import sideImg from "../assets/images/regSide.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    registerAs: '',
    qualification: '',
    securityQuestion: '',
    securityAnswer: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!/^[a-zA-Z]{1,30}$/.test(value)) {
          errorMessage = 'Name must contain only letters and be at most 30 characters long.';
        }
        break;
      case 'age':
        if (isNaN(value) || value < 18 || value > 180) {
          errorMessage = 'Age must be a number between 18 and 180.';
        }
        break;
      case 'email':
        if (!/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
          errorMessage = 'Invalid email address.';
        }
        break;
      case 'password':
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/.test(value)) {
          errorMessage = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          errorMessage = 'Passwords do not match.';
        }
        break;
      default:
        break;
    }

    // Update form data and error message
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', formData);
      const redirectTo = response.data.redirectTo;
      if (redirectTo === '/userExists') {
        navigate('/userExists'); // Navigate to 'userExists' route if user already exists
      } else if (redirectTo === '/login') {
        alert(response.data.welcomeMessage);
        navigate('/login'); // Navigate to 'login' route on successful registration
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="form-input block w-1/2 px-4 py-2 border border-gray-300 rounded-md text-base"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
            {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Age"
                className="form-input block w-1/2 px-4 py-2 border border-gray-300 rounded-md text-base"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
              <select
                placeholder="Gender"
                className="form-select block w-1/2 px-4 py-2 border border-gray-300 rounded-md text-base"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            {errors.age && <p className="text-red-500">{errors.age}</p>}
            <input
              type="email"
              placeholder="Email"
              className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
            <input
              type="password"
              placeholder="Password"
              className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
            <select
              placeholder="Register As"
              className="form-select block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
              name="registerAs"
              value={formData.registerAs}
              onChange={handleChange}
              required
            >
              <option value="">Register As</option>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
            {formData.registerAs === 'Doctor' && (
              <select
                placeholder="Qualification"
                className="form-select block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
              >
                <option value="">Qualification</option>
                <option value="MD">MD</option>
                <option value="PhD">PhD</option>
                <option value="MBBS">MBBS</option>
                <option value="MS">MS</option>
                <option value="DM">DM</option>
              </select>
            )}
            <select
              placeholder="Security Question"
              className="form-select block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
              name="securityQuestion"
              value={formData.securityQuestion}
              onChange={handleChange}
              required
            >
              <option value="">Security Question</option>
              <option value="motherMaidenName">What is your mother's maiden name?</option>
              <option value="firstPetName">What is the name of your first pet?</option>
              <option value="favoriteColor">What is your favorite color?</option>
              <option value="birthCity">In what city were you born?</option>
            </select>
            <input
              type="text"
              placeholder="Security Answer"
              className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
              name="securityAnswer"
              value={formData.securityAnswer}
              onChange={handleChange}
              required
            />
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
