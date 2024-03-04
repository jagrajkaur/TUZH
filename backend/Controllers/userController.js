import User from '../models/User.js';

/* @author: Jagraj Kaur
   @FileDescription: Implemented function to update, delete and fetch users from the database.
*/

export const updateUser = async(req,res)=>{
    const id = req.params.id;

    try{
        const updatedUser = await User.findByIdAndUpdate(id, {$set: req.body}, {new:true});

        res.status(200).json({success:true, message:"Successfully updated", data:updateUser});
    } catch(err) {
        res.status(500).json({success:false, message:"Failed to update"});
    }
}

export const deleteUser = async(req,res)=>{
    const id = req.params.id;

    try{
        await User.findByIdAndDelete(id);

        res.status(200).json({success:true, message:"Successfully deleted"});
    } catch(err) {
        res.status(500).json({success:false, message:"Failed to delete"});
    }
}

export const getSingleUser = async(req,res)=>{
    const id = req.params.id;

    try{
        const user = await User.findById(id).select("-password");   // to exclude the password field

        res.status(200).json({success:true, message:"User found", data:user});
    } catch(err) {
        res.status(404).json({success:false, message:"No user found"});
    }
}

export const getAllUser = async(req,res)=>{
    try{
        let query = {};
        if(req.query.user_type && req.query.user_type.toLowerCase() === 'doctor'){
            query.user_type = 'Doctor',
            query.isApproved = 'Approved'
        }
        
        const users = await User.find(query).select("-password");  // to exclude the password field
        if(users.length === 0) {
            return res.status(404).json({ success:false, message:"No user found" });
        }

        res.status(200).json({success:true, message:"Users found", data:users});
    } catch(err) {
        res.status(404).json({success:false, message:"Not found"});
    }
}