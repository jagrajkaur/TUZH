import { useContext, useEffect, useState } from 'react';
import '../styles/userProfile.css';
import { BASE_URL } from '../config';
import { authContext } from '../context/AuthContext';
import HashLoader from "react-spinners/HashLoader";
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, token } = useContext(authContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name:'',
        last_name:'',
        email:'',
        gender:'',
        user_type:'',
        date_of_birth:'',
        address:'',
        speciality:''
    });

    // Function to convert user type to readable format
    const getUserTypeLabel = (userType) => {
        switch (userType) {
            case 'Patient':
                return 'Patient';
            case 'Doctor':
                return 'Doctor';
            case 'Admin':
                return 'Admin';
            default:
                return '';
        }
    };

    // Fetch profile details from the backend
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/users/${user._id}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = await response.json();
            
            // Format date of birth to 'yyyy-MM-dd' format
            const dob = new Date(responseData.data.date_of_birth).toISOString().split('T')[0];
            
            setFormData({
                ...responseData.data,
                date_of_birth: dob,
                user_type: getUserTypeLabel(responseData.data.user_type) // Convert user type to readable format
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    // Function to handle update API call
    const handleUpdateProfile = async () => {
        try {
            setLoading(true);

            // Exclude user_type from formData before sending the request
            const { user_type, ...formDataWithoutUserType } = formData;

            // Calculate the age based on the provided date of birth
            const dob = new Date(formData.date_of_birth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            // Check if the user is at least 18 years old
            if (age < 18) {
                setLoading(false);
                return toast.error("You must be at least 18 years old to sign up.");
            }

            const response = await fetch(`${BASE_URL}/users/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formDataWithoutUserType)
            });
            const { message } = await response.json();

            if(!response.ok){
                throw new Error(message)
            }

            setLoading(false);
            toast.success(message);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user._id, token]);

    return (
        <div id="myProfile_container" className="wrap wide">
            <div className="inner mx-auto bg-[#e3f8f8] rounded-r-3xl rounded-bl-[1.5rem]">
            <header className="flex justify-between items-center mb-6">
                <h1 className="font-semibold">
                    Update your <span className="text-[#ff914d]">Profile </span> information
                </h1>
            </header>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="first-name">First Name</label>
                    <input 
                        id="first-name"
                        type="text" 
                        placeholder="Enter your first name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                        focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                        placeholder:text-textColor cursor-pointer"
                        required
                    />
                </div>
                <div className="space-y-2 ml-3">
                    <label htmlFor="last-name">Last Name</label>
                    <input 
                        id="last-name" 
                        type="text" 
                        placeholder="Enter your last name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                        focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                        placeholder:text-textColor cursor-pointer"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                        focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                        placeholder:text-textColor cursor-pointer"
                        required
                    />
                </div>
                <div className="space-y-2 ml-3">
                    <label htmlFor="gender">Gender</label>
                    <select 
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                        focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                        placeholder:text-textColor cursor-pointer"
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="user-type">User Type</label>
                    <input 
                        id="user-type"
                        type="text"
                        name="user_type" 
                        value={formData.user_type}
                        readOnly  // role cann't be changed
                        className={`w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                        focus:border-b-primaryColor text-[16px] leading-7 ${formData.user_type ? 'read-only-input' : 'text-headingColor'}
                        placeholder:text-textColor cursor-pointer`}
                    />
                </div>
                <div className="space-y-2 ml-3">
                    <label htmlFor="dob">Date of Birth</label>
                    <input 
                        id="dob"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                        focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                        placeholder:text-textColor cursor-pointer"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="address">Address</label>
                    <input 
                        id="address"
                        type="text"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                        focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                        placeholder:text-textColor cursor-pointer"
                        required
                    />
                </div>

                {formData.user_type === 'Doctor' && (
                    <div className="space-y-2 ml-3">
                        <label htmlFor="speciality">Speciality</label>
                        <select 
                            name="speciality" 
                            value={formData.speciality}
                            onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                            className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                            focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                            placeholder:text-textColor cursor-pointer"
                        >
                            <option value="">Select</option>
                            <option value="clinical_psychology">Clinical Psychology</option>
                            <option value="psychotherapy">Psychotherapy</option>
                            <option value="neuropsychology">Neuropsychology</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="mt-7">
                <button
                    disabled={loading && true}
                    onClick={handleUpdateProfile}
                    type="button" 
                    className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                >
                    {loading ? (<HashLoader size={35} color="#ffffff" />) : ('Save')}
                </button>
            </div>

            
            </div>
        </div>
    )
};

export default Profile;