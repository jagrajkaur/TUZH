import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* @author: Jagraj Kaur
   @FileDescription: Implemented function to authenticate the users and pass the control to next function
*/

/* JK - To verify the access token for the logged in user */
export const authenticate = async(req, res, next) => {

    // get the token from the headers
    const authToken = req.headers.authorization

    // check token is exists
    if(!authToken || !authToken.startsWith('Bearer ')) {
        return res.status(401).json({success:false, message:"No token, authorization denied"});
    }

    try {
        const token = authToken.split(" ")[1];

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.userId = decoded.id
        req.role = decoded.role

        next();      // must call the next function after authorization to pass the control to next function
    } catch (err) {
        if(err.name === "TokenExpiredError"){
            return res.status(401).json({message:'Token is expired'});
        }

        return res.status(401).json({success:false, message:'Invalid token'});
    }
}

/* JK - To restrict the user based on the specified roles only */
export const restrict = roles => async(req,res,next)=>{
    const userId = req.userId;

    let user;

    const foundUser = await User.findById(userId);

    if(foundUser){
        user = foundUser;
    }

    if(!roles.includes(user.user_type)){
        return res.status(401).json({success:false, message:"You're not authorized"});
    }

    next();     // must call the next function after authorization to pass the control to next function
}