// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';

// /* @author: Jagraj Kaur
//    @FileDescription: Implemented function to register new user(patient/doctor)
//    To implement the login function to verify the details and generate token for valid users.
// */

// const generateToken = user => {
//     return jwt.sign(
//         {id:user._id, role:user.user_type}, 
//         process.env.JWT_SECRET_KEY, 
//         {expiresIn: "15d"}
//     )
// }

// //Register a new user
// export const register = async (req, res) => {
//     const {first_name, last_name, date_of_birth, gender, address, email, password, user_type, speciality} = req.body;

//     try{
//         let user = await User.findOne({email});

//         //check if user exist
//         if(user){
//             return res.status(400).json({message:'User already exists'});
//         }

//         //hashing password for security using bcrypt js library
//         const salt = await bcrypt.genSalt(10);
//         const hashPassword = await bcrypt.hash(password, salt);

//         user = new User({
//             first_name,
//             last_name,
//             date_of_birth,
//             gender,
//             address,
//             email,
//             password:hashPassword,
//             user_type
//         })

//         //Add speciality if user type is 'doctor'
//         if(user_type === 'doctor'){
//             if(!speciality){
//                 return res.status(400).json({ message: "Speciality is required for doctors" });
//             }
//             user.speciality = speciality;
//         }

//         //Save user to database
//         await user.save();

//         res.status(200).json({ success:true, message: "User registered successfully" });

//     } catch(err){
//         console.log(err.message);
//         res.status(500).json({ success:false, message: "Internal server error, Try again" });
//     }
// };

// //to login existing user after validating credentials
// export const login = async(req,res)=>{
//     const {email} = req.body;

//     try {
//         let user = null;

//         const foundUser = await User.findOne({email});
//         if(foundUser) {
//             user = foundUser;
//         }

//         //check if user exist or not
//         if(!user){
//             return res.status(404).json({ message: "User not found" });
//         }
    
//         //compare password
//         const isPasswordMatch = await bcrypt.compare(req.body.password, foundUser.password);
//         if(!isPasswordMatch){
//             return res.status(400).json({ status:false, message: "Invalid credentials" });
//         }

//         //get token
//         const token = generateToken(user);

//         const {password, user_type, ...rest} = user._doc;

//         return res.status(200).json({ status:true, message: "Successfully login", token, data:{...rest}, role:user_type });

//     } catch (err) {
//         return res.status(500).json({ status:false, message: "Failed to login" });
//     }
// }





// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Assuming you have defined the User model

// Initialize Express app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

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
      return res.status(400).json({ message: "Email already exists" });
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
      qualification: registerAs === 'Doctor' ? qualification : undefined,
      securityQuestion,
      securityAnswer
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
