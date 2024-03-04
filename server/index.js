// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Import cors module
const User = require('./models/Users');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/TUZH")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define registration endpoint
app.post('/register', async (req, res) => {
  try {
    // Extract user data from request body
    const { firstName, lastName, age, gender, email, password, confirmPassword, registerAs, qualification, securityQuestion, securityAnswer } = req.body;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", redirectTo: '/userExists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      firstName,
      lastName,
      age,
      gender,
      email,
      password: hashedPassword,
      registerAs,
      qualification: (registerAs === 'Doctor') ? qualification : undefined,
      securityQuestion,
      securityAnswer
    });

    // Save the user to the database
    await newUser.save();

    // Send a welcome message to the user
    const welcomeMessage = `Welcome to TUZH, ${firstName}!`;
    res.status(201).json({ message: "User registered successfully", welcomeMessage: welcomeMessage , redirectTo: '/login'});
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post('/login', async (req, res) => {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;
  
      // Check if email exists in the database
      const user = await User.findOne({ email });
  
      if (!user) {
        // User not found
        return res.status(400).json({ success: false, message: "Invalid email or password" });
      }
  
      // Check if password matches
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        // Password doesn't match
        return res.status(400).json({ success: false, message: "Invalid email or password" });
      }
  
      // Login successful
      res.json({ success: true });
  
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
