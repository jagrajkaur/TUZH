import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import patientAssessmentRoute from "./Routes/patientAssessment.js";
import adminRoute from "./Routes/admin.js";
import appointmentRoute from "./Routes/appointment.js";
import mytask from "./Routes/mytask.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin:true,
};

app.get('/', (req,res) => {
    res.send("API is working");
});

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/TUZH")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


// database connection
// mongoose.set('strictQuery', false);
// const connectDB = async () => {
//     try{
//         await mongoose.connect(process.env.MONGO_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });

//         console.log("MongoDB database is connected");
//     } catch (err) {
//         console.log("MongoDB database connection is failed");
//     }
// }

// middleware 
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/assessments', patientAssessmentRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/appointment', appointmentRoute);
app.use('/api/v1/mytask', mytask);

app.listen(port, () => {
    // connectDB();
    console.log("Server is running on port" + port);
});