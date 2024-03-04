const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Adjust minimum password length as needed
  },
  registerAs: {
    type: String,
    enum: ['Patient', 'Doctor'],
    required: true
  },
  qualification: {
    type: String,
    enum: ['MD', 'PhD', 'MBBS', 'MS', 'DM'] // Only for Doctor registration
  },
  securityQuestion: {
    type: String,
    required: true
  },
  securityAnswer: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
