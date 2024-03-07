import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
    const {first_name, last_name, date_of_birth, gender, address, email, password, confirmPassword, user_type, speciality} = req.body;

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

    if(confirmPassword != password) {
        return res.status(403).json({ message: "Both the passwords don't match" });
    }

    try{
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

        //Save user to database
        await user.save();

        res.status(200).json({ success:true, message: "User registered successfully" });

    } catch(err){
        console.log(err.message);
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
       
        //compare password
        const isPasswordMatch = await bcrypt.compare(req.body.password, foundUser.password);
        if(!isPasswordMatch){
            return res.status(400).json({ status:false, message: "Incorrect password" });
        }

        //get token
        const token = generateToken(user);

        const {password, user_type, ...rest} = user._doc;

        return res.status(200).json({ status:true, message: "Successfully login", token, data:{...rest}, role:user_type });

    } catch (err) {
        return res.status(500).json({ status:false, message: "Failed to login" });
    }
}