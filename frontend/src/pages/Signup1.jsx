import React, { useState } from "react";
import signupImg from "../assets/images/signup.gif";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const Signup = () => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name:'',
        last_name:'',
        email:'',
        password:'',
        confirm_password:'',
        gender:'',
        user_type:"Patient",
        date_of_birth:'',
        address:'',
        speciality:''
    })

    const navigate = useNavigate();

    const handleInputChange = e=> {
        setFormData({ ...formData, [e.target.name]:e.target.value})
    }

    const submitHandler = async event=>{
        event.preventDefault();
        setLoading(true);

        try {
            console.log(formData);
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(formData),
            });

            const { message } = await res.json();

            if(!res.ok){
                throw new Error(message)
            }

            setLoading(false);
            toast.success(message);
            navigate("/login");

        } catch (err) {
            toast.error(err.message);
            setLoading(false);
        }
    }

    return (
        <section className="px-5 xl:px-0">
            <div className="max-w-[1190px] mx-auto">
                <div className="grid frid-cols-1 lg:grid-cols-2">
                    {/* ========== img box ========== */}
                    <div className="hidden lg:block bg-primaryColor rounded-l-lg">
                        <figure className="rounded-l-lg">
                            <img src={signupImg} alt="" className="w-full rounded-l-lg" />
                        </figure>
                    </div>

                    {/* ========== sign up form ========== */}
                    <div className="rounded-l-lg lg:pl-16 py-5">
                        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-5">
                            Create an <span className="text-primaryColor">account</span>
                        </h3>

                        <form onSubmit={submitHandler}>
                            <div className="mb-5 flex items-center justify-between">
                                <input 
                                    type="text" 
                                    placeholder="First Name" 
                                    name="first_name" 
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                                    placeholder:text-textColor cursor-pointer"
                                    required
                                /> 
                                <input 
                                    type="text" 
                                    placeholder="Last Name" 
                                    name="last_name" 
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 ml-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                                    placeholder:text-textColor cursor-pointer"
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <input 
                                    type="email" 
                                    placeholder="Enter Your Email" 
                                    name="email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                                    placeholder:text-textColor cursor-pointer"
                                    required
                                />
                            </div>
                            <div className="mb-5 flex items-center justify-between">
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    name="password" 
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                                    placeholder:text-textColor cursor-pointer"
                                    required
                                />
                                <input 
                                    type="password" 
                                    placeholder="Confirm Password" 
                                    name="confirm_password" 
                                    value={formData.confirm_password}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 ml-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                                    placeholder:text-textColor cursor-pointer"
                                    required
                                />
                            </div>

                            <div className="mb-5">
                                <input 
                                    type="text" 
                                    placeholder="Enter Your Address" 
                                    name="address" 
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                                    placeholder:text-textColor cursor-pointer"
                                    required
                                />
                            </div>

                            <div className="mb-5 flex items-center justify-between">
                                <label className="text-headingColor font-bold text-[16px] leading-7">
                                    Are you a:
                                    <select 
                                        name="user_type" 
                                        value={formData.user_type}
                                        onChange={handleInputChange} 
                                        className="text-textColor font-semibold text-[15px] leading-7 px-4 py-2 focus:outline-none"
                                    >
                                        <option value="Patient">Patient</option>
                                        <option value="Doctor">Doctor</option>
                                    </select>
                                </label>

                                <label className="text-headingColor font-bold text-[16px] leading-7">
                                    Gender:
                                    <select 
                                        name="gender" 
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="text-textColor font-semibold text-[15px] leading-7 px-4 py-2 focus:outline-none"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </label>
                            </div>

                            <div className="mb-5 flex items-center justify-between">
                                <label className="text-headingColor font-bold text-[16px] leading-7">
                                    DOB:
                                    <input 
                                        type="date" 
                                        placeholder="Date of Birth" 
                                        name="date_of_birth" 
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                        className="w-3/7 pl-1 py-3 focus:outline-none 
                                        focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                                        placeholder:text-textColor cursor-pointer"
                                        required
                                    />
                                </label>
                                
                                {/* Conditionally render the speciality field if user_type is 'Doctor' */}
                                {formData.user_type === 'Doctor' && (
                                    <label className="text-headingColor font-bold text-[16px] leading-7">
                                        Speciality:
                                        <select 
                                            name="speciality" 
                                            value={formData.speciality}
                                            onChange={handleInputChange}
                                            className="py-3 text-textColor font-semibold 
                                            text-[15px] leading-7 px-1 py-3 focus:outline-none"
                                        >
                                            <option value="">Select</option>
                                            <option value="clinical_psychology">Clinical Psychology</option>
                                            <option value="psychotherapy">Psychotherapy</option>
                                            <option value="neuropsychology">Neuropsychology</option>
                                        </select>
                                    </label>
                                )}
                            </div>

                            <div className="mt-7">
                                <button
                                    disabled={loading && true}
                                    type="submit" 
                                    className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                                >
                                    {loading ? (<HashLoader size={35} color="#ffffff" />) : ('Sign Up')}
                                </button>
                            </div>

                            <p className="mt-5 text-textColor text-center">
                                Already have an account
                                <Link to='/login' className="text-primaryColor font-medium ml-1">
                                    Login
                                </Link>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;