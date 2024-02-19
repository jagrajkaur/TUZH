import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


console.log("------Inside controller-----");
//Register a new user
export const register = async (req, res) => {
    console.log("=== Hi lets create the user account ===");
    console.log(req.body);
    const {first_name, last_name, date_of_birth, gender, address, email, password, user_type, speciality} = req.body

    try{
        let user = await User.findOne({email});

        //check if user exist
        if(user){
            return res.staus(400).json({message:'User already exists'})
        }

        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

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
                return res.staus(400).json({ message: "Speciality is required for doctors" });
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

export const login = async(req,res)=>{
    console.log("Hi this is login function");
}