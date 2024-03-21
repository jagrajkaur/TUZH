const mongoose = require('mongoose');

// Defining the schema for the User model
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  registerAs: {
    type: String,
    enum: ['Patient', 'Doctor'],
    required: true
  },
  qualification: {
    type: String,
    enum: ['MD', 'PhD', 'MBBS', 'MS', 'DM']
  }
});

// Creating the User model using the schema
const User = mongoose.model('User', userSchema);

// Exporting the User model
module.exports = User;
