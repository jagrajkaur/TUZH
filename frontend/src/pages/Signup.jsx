import React, { useState } from 'react';



function Signup() {
  // State variables to store form data
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

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Processing form data here (e.g., send it to a server)
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
      qualification
    });
    // Resetting form fields
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

  // Options for the "Register as" dropdown
  const registerOptions = ['Patient', 'Doctor'];

  // Options for the "Qualification" dropdown
  const qualificationOptions = ['MD', 'PhD', 'MBBS', 'MS', 'DM'];

  return (
    <div className="container">
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <table className="table">
          <tbody>
            <tr>
              <td>
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </td>
              <td>
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  id="age"
                  className="form-control"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </td>
              <td>
                <span>Gender:</span>
                <div>
                  <label htmlFor="male" className="radio-label">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      required
                    />{' '}
                    Male
                  </label>
                  <label htmlFor="female" className="radio-label">
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      required
                    />{' '}
                    Female
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <label htmlFor="address">Address:</label>
                <textarea
                  id="address"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </td>
              <td>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </td>
              <td>
                <label htmlFor="registerAs">Register as:</label>
                <select
                  id="registerAs"
                  className="form-control"
                  value={registerAs}
                  onChange={(e) => setRegisterAs(e.target.value)}
                  required
                >
                  <option value="">Select Option</option>
                  {registerOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            {registerAs === 'Doctor' && (
              <tr>
                <td colSpan="2">
                  <label htmlFor="qualification">Qualification:</label>
                  <select
                    id="qualification"
                    className="form-control"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    required
                  >
                    <option value="">Select Qualification</option>
                    {qualificationOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default Signup;
