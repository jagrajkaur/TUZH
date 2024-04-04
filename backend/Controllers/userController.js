import User from '../models/User.js';
import redisClient from '../redis.js';

/* @author: Jagraj Kaur
   @FileDescription: Implemented function to update, delete and fetch users from the database.
*/

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email

export const updateUser = async(req,res)=>{
    const id = req.params.id;

    try{
        const {first_name, email, user_type} = req.body;

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
        
        // Check if user type is trying to be updated
        if (user_type) {
            return res.status(403).json({ message: "User type cannot be updated directly" });
        }

        // Check if the email already exists for a different user
        const existingUser = await User.findOne({ email, _id: { $ne: id } }); // Exclude current user ID
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered with another user" });
        }

        const updatedUser = await User.findByIdAndUpdate(id, {$set: req.body}, {new:true});
        await redisClient.del('cachedUsers'); // Clear cached users after update

        res.status(200).json({success:true, message:"Successfully updated", data:updatedUser});
    } catch(err) {
        res.status(500).json({success:false, message:"Failed to update"});
    }
}

export const deleteUser = async(req,res)=>{
    const id = req.params.id;

    try{
        await User.findByIdAndDelete(id);
        await redisClient.del('cachedUsers'); // Clear cached users after delete

        res.status(200).json({success:true, message:"Successfully deleted"});
    } catch(err) {
        res.status(500).json({success:false, message:"Failed to delete"});
    }
}

export const getSingleUser = async(req,res)=>{
    const id = req.params.id;

    try{
        const user = await User.findById(id).select("-password");   // to exclude the password field
        // Cache the user data with a specific key (e.g., user ID)
        await redisClient.set(`cachedUser:${id}`, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour

        res.status(200).json({success:true, message:"User found", data:user});
    } catch(err) {
        res.status(404).json({success:false, message:"No user found"});
    }
}

export const getAllUser = async(req,res)=>{
    try{
        const cachedUsers = await redisClient.get('cachedUsers');
        if(cachedUsers){
            // If users data is cached, return it from Redis
            return res.status(200).json({ success:true, message:"Users found", data: JSON.parse(cachedUsers) });
        }

        let query = {};
        if(req.query.user_type && req.query.user_type.toLowerCase() === 'doctor'){
            query.user_type = 'Doctor',
            query.isApproved = 'Approved'
        }
        
        const users = await User.find(query).select("-password");  // to exclude the password field
        if(users.length === 0) {
            return res.status(404).json({ success:false, message:"No user found" });
        }

        //Cache the users data
        await redisClient.set('cachedUsers', JSON.stringify(users), 'EX', 3600);   //Cache for one hour

        res.status(200).json({success:true, message:"Users found", data:users});
    } catch(err) {
        res.status(404).json({success:false, message:"Not found"});
    }
}