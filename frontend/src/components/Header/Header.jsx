import { useEffect, useRef, useContext, useState } from "react";
import logo from "../../assets/images/logo.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { authContext } from "../../context/AuthContext";

/* @author: Jagraj Kaur
   @FileDescription: To render the Header component
*/

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { user, role, token, dispatch } = useContext(authContext);
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    setShowProfileDropdown(false); // Close the dropdown when logging out
    navigate("/");
  };

  useEffect(() => {
    handleStickyHeader();

    return () =>
      window.removeEventListener("scroll", handleStickyHeader);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prevState) => !prevState);
  };

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
      path: "/PatientAppointments",
      display: "My Appointment",
    },
    {
        path:'/contact',
        display:'Contact'
    },
  ].filter(Boolean); // Filter out null values

  // Define menu items based on user role
  const getMenuItems = () => {
    if (role === "Doctor") {
      // Return admin menu items
      return [
        { path: "dashboard", display: "Dashboard" },
        { path: "/doctor/addAvailablity", display: "Add Availability" },
        { path: "/doctor/myAvailability", display: "My Availabilities" },
        { path: "/doctor/myAppointments", display: "My Appointments" },
        { path: "/doctor/pendingRequests", display: "Appointment Requests" },
      ];
    } else {
      // Return default menu items for other roles
      return navLinks;
    }
  };

  const menuItems = getMenuItems();

  return (
    <header className="header flex item-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
           {/* ======== logo ========= */}
          <div>
            <img src={logo} alt="" className="w-full h-16" />
          </div>

          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {menuItems.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600]"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {token && user ? (
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-2"
                >
                  <h2>{user?.first_name}</h2>
                  <BiMenu className="w-8 h-6" />
                </button>

                {showProfileDropdown && (
                  <ul className="absolute right-0 bg-white border rounded shadow-md">
                    {/* Add links for profile section */}
                    <li>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}

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
  );
};

export default Header;
