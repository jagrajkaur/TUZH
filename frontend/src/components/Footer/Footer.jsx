import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex justify-center md:justify-start items-center mb-4 md:mb-0">
          <p className="text-sm mr-4">Follow Us:&nbsp;&nbsp;<span className="text-yellow-500">@TUZH_CANADA</span></p>
          <div className="flex space-x-2">
            <a href="#" className="text-white hover:text-blue-400">
              <FaFacebook />
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              <FaInstagram />
            </a>
          </div>
        </div>
        <p className="text-sm">&copy; TUZH. 2024. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
