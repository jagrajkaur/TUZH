import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sideImg from "../assets/images/regSide.png";

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerAs, setRegisterAs] = useState('');
  const [qualification, setQualification] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Z ]{1,30}$/; // Allows only letters and spaces, max length 30
    return regex.test(name);
  };

  const validateAge = (age) => {
    return parseInt(age) > 18;
  };

  const validatePasswordMatch = () => {
    return password === confirmPassword;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    } else {
      setEmailError('');
    }

    // Validate first name
    if (!validateName(firstName)) {
      setFirstNameError('First name must contain only letters and be max 30 characters long');
      return;
    } else {
      setFirstNameError('');
    }

    // Validate last name
    if (!validateName(lastName)) {
      setLastNameError('Last name must contain only letters and be max 30 characters long');
      return;
    } else {
      setLastNameError('');
    }

    // Validate age
    if (!validateAge(age)) {
      setAgeError('Age must be greater than 18');
      return;
    } else {
      setAgeError('');
    }

    // Validate password match
    if (!validatePasswordMatch()) {
      setPasswordError('Passwords do not match');
      setConfirmPasswordError('Passwords do not match');
      return;
    } else {
      setPasswordError('');
      setConfirmPasswordError('');
    }

    console.log({
      firstName,
      lastName,
      age,
      gender,
      email,
      password,
      confirmPassword,
      registerAs,
      qualification,
      securityQuestion,
      securityAnswer
    });

    // Reset form fields
    setFirstName('');
    setLastName('');
    setAge('');
    setGender('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRegisterAs('');
    setQualification('');
    setSecurityQuestion('');
    setSecurityAnswer('');
  };

  const registerOptions = ['Patient', 'Doctor'];
  const qualificationOptions = ['MD', 'PhD', 'MBBS', 'MS', 'DM'];
  const securityQuestions = ['What is your mother\'s maiden name?', 'What is the name of your first pet?', 'What is your favorite color?', 'In what city were you born?'];

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
        className={`form-input block w-1/2 px-4 py-2 border border-gray-300 rounded-md text-base ${firstNameError ? 'border-red-500' : ''}`}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        className={`form-input block w-1/2 px-4 py-2 border border-gray-300 rounded-md text-base ${lastNameError ? 'border-red-500' : ''}`}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
    </div>
    {firstNameError && <p className="text-red-500 text-sm">{firstNameError}</p>}
    {lastNameError && <p className="text-red-500 text-sm">{lastNameError}</p>}
    <div className="flex space-x-4">
      <input
        type="number"
        placeholder="Age"
        className={`form-input block w-1/2 px-4 py-2 border border-gray-300 rounded-md text-base ${ageError ? 'border-red-500' : ''}`}
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
    {ageError && <p className="text-red-500 text-sm">{ageError}</p>}
    <input
      type="email"
      placeholder="Email"
      className={`form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base ${emailError ? 'border-red-500' : ''}`}
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
    <input
      type="password"
      placeholder="Password"
      className={`form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base ${passwordError ? 'border-red-500' : ''}`}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <input
      type="password"
      placeholder="Confirm Password"
      className={`form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base ${confirmPasswordError ? 'border-red-500' : ''}`}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
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
    <select
      placeholder="Security Question"
      className="form-select block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
      value={securityQuestion}
      onChange={(e) => setSecurityQuestion(e.target.value)}
      required
    >
      <option value="">Security Question</option>
      {securityQuestions.map((question, index) => (
        <option key={index} value={question}>{question}</option>
      ))}
    </select>
    <input
      type="text"
      placeholder="Security Answer"
      className="form-input block w-full px-4 py-2 border border-gray-300 rounded-md text-base"
      value={securityAnswer}
      onChange={(e) => setSecurityAnswer(e.target.value)}
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
