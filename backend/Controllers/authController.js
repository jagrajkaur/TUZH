import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/* @author: Jagraj Kaur
   @FileDescription: Implemented function to register new user(patient/doctor)
   To implement the login function to verify the details and generate token for valid users.
*/

const generateToken = user => {
    return jwt.sign(
        {id:user._id, role:user.user_type}, 
        process.env.JWT_SECRET_KEY, 
        {expiresIn: "15d"}
    )
}

//Register a new user
export const register = async (req, res) => {
    const {first_name, last_name, date_of_birth, gender, address, email, password, user_type, speciality} = req.body;

    try{
        let user = await User.findOne({email});

        //check if user exist
        if(user){
            return res.status(400).json({message:'User already exists'});
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
        if(user_type === 'doctor'){
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

//to login existing user after validating credentials
export const login = async(req,res)=>{
    const {email} = req.body;

    try {
        let user = null;

        const foundUser = await User.findOne({email});
        if(foundUser) {
            user = foundUser;
        }

        //check if user exist or not
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
    
        //compare password
        const isPasswordMatch = await bcrypt.compare(req.body.password, foundUser.password);
        if(!isPasswordMatch){
            return res.status(400).json({ status:false, message: "Invalid credentials" });
        }

        //get token
        const token = generateToken(user);

        const {password, user_type, ...rest} = user._doc;

        return res.status(200).json({ status:true, message: "Successfully login", token, data:{...rest}, role:user_type });

    } catch (err) {
        return res.status(500).json({ status:false, message: "Failed to login" });
    }
}