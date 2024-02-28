import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, subject, message });
    // You can add further logic here, such as sending the form data to a backend server
    // or displaying a confirmation message to the user
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div style={{ background: 'linear-gradient(to right, #C0DFFF, #FFFFFF, #FFE4B5)' }} className="w-full justify-center flex lg:flex-row mx-4 lg:mx-auto rounded-lg shadow-lg overflow-hidden bg-white">
        {/* Form Section */}
        <div className="lg:w-2/3 p-8 overflow-y-auto">
          <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="form-input block w-full px-4 py-3 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="form-input block w-full px-4 py-3 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              className="form-input block w-full px-4 py-3 border border-gray-300 rounded-md"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              placeholder="Your Message"
              className="form-textarea block w-full px-4 py-3 border border-gray-300 rounded-md"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              required
            />
            <button type="submit" className="btn-primary w-full py-3 bg-blue-500 text-white font-semibold rounded-md">Submit</button>
          </form>
          <div className="mt-6">
            <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
