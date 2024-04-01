import {useEffect, useRef, useContext} from "react";
import logo from "../../assets/images/logo.png";
import userImg from "../../assets/images/avatar-icon.png";
import { NavLink, Link, useNavigate} from "react-router-dom";
import {BiMenu} from "react-icons/bi";
import { authContext } from "../../context/AuthContext";

/* @author: Jagraj Kaur
   @FileDescription: To render the Header component
*/

const Header = () => {

    const headerRef = useRef(null);
    const menuRef = useRef(null);
    const {user, role, token, dispatch} = useContext(authContext);
    const navigate = useNavigate();

    const handleStickyHeader = () =>{
        window.addEventListener('scroll', ()=> {
            if(document.body.scrollTop > 80 || document.documentElement.scrollTop > 80){
                headerRef.current.classList.add('sticky__header');
            } else {
                headerRef.current.classList.remove('sticky__header');
            }
        })
    }

    const handleLogout = ()=>{
        dispatch({type:"LOGOUT"})
        navigate('/')
    }

    useEffect(()=>{
        handleStickyHeader();

        return () => window.removeEventListener('scroll', handleStickyHeader);
    });

    const toggleMenu = () => menuRef.current.classList.toggle('show__menu');

    const navLinks = [
        {
            path:'/home',
            display:'Home'
        },
        token && role && role === "Patient" ? {
            path:'/mytasks',
            display:'My Tasks'
        } : null,
        {
            path:'/bookappointment',
            display:'Book Appointment'
        },
        {
            path:'/contact',
            display:'Contact'
        },
    ].filter(Boolean); // Filter out null values

    return (
        <header className="header flex item-center" ref={headerRef}>
            <div className="container">
                <div className="flex items-center justify-between">
                    {/* ======== logo ========= */}
                    <div>
                        <img src={logo} alt="" className="w-full h-16"/>
                    </div>

                    {/* ======== menu ========= */}
                    <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                        <ul className="menu flex items-center gap-[2.7rem]">
                            {navLinks.map((link,index) => (
                                <li key={index}>
                                    <NavLink to={link.path} className={navClass => 
                                        navClass.isActive 
                                            ? 'text-primaryColor text-[16px] leading-7 font-[600]' 
                                            : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor'
                                        }
                                    >
                                        {link.display}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ======== nav right ========= */}
                    <div className="flex items-center gap-4">

                        {token && user ? (
                            <div className="flex items-center gap-2">
                                <Link to="/" className="hidden">
                                    <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                                        <img src={userImg} alt=""  className="w-full rounded-full" />
                                    </figure>
                                </Link>
                                <h2>{user?.first_name}</h2>
                                <button
                                    onClick={handleLogout}
                                    className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/register">
                                    <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                                        SignUp
                                    </button>
                                </Link>
                                <Link to="/login">
                                    <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                                        Login
                                    </button>
                                </Link>
                            </div>
                        )}

                        <span className="md:hidden" onClick={toggleMenu}>
                            <BiMenu className="w-6 h-6 cursor-pointer" />
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )};

export default Header;