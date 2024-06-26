import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as taskController from '../Controllers/mytaskcontroller.js';
import sendEmail from '../emailService.js';

/* @author: Jagraj Kaur
   @FileDescription: Implemented function to register new user(patient/doctor)
   To implement the login function to verify the details and generate token for valid users.
*/

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

/* To generte the JWT token for logged in user based on user id and role */
const generateToken = user => {
    return jwt.sign(
        {id:user._id, role:user.user_type}, 
        process.env.JWT_SECRET_KEY, 
        {expiresIn: "15d"}
    )
}

/* To register a new user after validating the inputs */
export const register = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {first_name, last_name, date_of_birth, gender, address, email, password, confirm_password, user_type, speciality} = req.body;

        //validate user inputs
        if (first_name.length <= 2) {
            return res.status(403).json({ message: "First name must be atleast 3 characters" });
        }

        if (!email.length) {
            return res.status(403).json({ message: "Email is mandatory" });
        }

        if (!emailRegex.test(email)) {
            return res.status(403).json({ message: "Invalid email or format. Email should be in format abc@xyz.com" });
        }

        if (!passwordRegex.test(password)) {
            return res.status(403).json({ message: "Password should be between 6-20 characters and must have at least one numeric and one uppercase." })
        }

        if(confirm_password != password) {
            return res.status(403).json({ message: "Both the passwords don't match" });
        }

        let user = await User.findOne({email});

        //check if user exist
        if(user){
            return res.status(400).json({ message: "User with the same email already exists" });
        }

        //hashing password for security using bcrypt js library
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        user = new User({
            first_name,
            last_name,
            date_of_birth,
            gender,
            address,
            email,
            password:hashPassword,
            user_type
        })

        //Add speciality if user type is 'doctor'
        if(user_type === 'Doctor'){
            if(!speciality){
                return res.status(400).json({ message: "Speciality is required for doctors" });
            }
            user.speciality = speciality;
        }

        //Save user to database within transaction
        const newUser = await user.save({ session });

        // To save the pre-defined tasks for new patient
        if(newUser.user_type === 'Patient') {
            try {
                await taskController.savePredefinedTasks(newUser._id, { session });
            } catch (err) {
                console.log(err.message);
                res.status(500).json({ message: "Error saving predefined tasks" });
            }
        }

        let emailConfig = {
            subject : 'Welcome to TUZH Family!',
            text: "Greetings from TUZH family! We are excited to work with you and are happy to have you on board. Our platform is made to ensure that your experience is easy and effective, whether you're a patient looking for high-quality mental health care or a doctor offering professional treatment.",
            hmtl: '<h5>Greetings from TUZH family!</h5><br> <p>We are excited to work with you and are happy to have you on board. Our platform is made to ensure that your experience is easy and effective, whether you\'re a patient looking for high-quality mental health care or a doctor offering professional treatment.</p>',
        }

        // Send welcome email to the registered user using emailConfig
        try {
            await sendEmail(newUser.email, emailConfig.subject, emailConfig.text, emailConfig.hmtl);    
        } catch (emailError) {
            // Rollback the transaction and end session if email sending fails
            await session.abortTransaction();
            session.endSession();
            
            console.error('Error sending welcome email:', emailError);
            return res.status(500).json({ success: false, message: "Failed to send welcome email. Please try again." });
        }
        
        await session.commitTransaction(); // Commit the transaction
        session.endSession();

        res.status(200).json({ success:true, message: "User registered successfully. Welcome email sent." });
    } catch(err){
        console.log(err.message);
        await session.abortTransaction(); // Rollback the transaction if an error occurs
        session.endSession();
        res.status(500).json({ success:false, message: "Internal server error, Try again" });
    }
};

/* To login existing user after validating credentials */
export const login = async(req,res)=>{
    const {email, password} = req.body;

    if(!email || !password) {
        return res.staus(400).json({ message:"Please enter all the details" });
    }

    try {
        let user = null;

        const foundUser = await User.findOne({email});
        if(!foundUser) {    //check if user exist with this email or not
            return res.status(404).json({ message: "User with this email does not exist" }); 
        }
        
        user = foundUser;

        // Check if the user is approved
        if (user.isApproved === "Pending") {
            return res.status(403).json({ message: "Your request is pending. Try again later" });
        }

        if (user.isApproved === "Rejected") {
            return res.status(403).json({ message: "Your request was Rejected." });
        }
       
        //compare password
        const isPasswordMatch = await bcrypt.compare(req.body.password, foundUser.password);
        if(!isPasswordMatch){
            return res.status(400).json({ status:false, message: "Incorrect password" });
        }

        //get token
        const token = generateToken(user);

        /* to exclude password and user type info from user doc */
        const {password, user_type, ...rest} = user._doc;

        return res.status(200).json({ status:true, message: "Successfully login", token, data:{...rest}, role:user_type });

    } catch (err) {
        return res.status(500).json({ status:false, message: "Failed to login" });
    }
}