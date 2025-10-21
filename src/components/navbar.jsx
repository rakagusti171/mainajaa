// frontend/src/components/Navbar.jsx
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Ikon panah kecil untuk dropdown
const ChevronDownIcon = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
  </svg>
);

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 relative z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-purple-400">
          Mainajaa
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white font-semibold">Home</Link>
          <Link to="/semua-akun" className="text-gray-400 hover:text-white">Beli Akun</Link>
          <Link to="/top-up" className="text-gray-400 hover:text-white">Top Up</Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            // Tampilan Setelah Login
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-white hover:text-purple-400 font-semibold focus:outline-none"
              >
                Hi, {user.username}
                <ChevronDownIcon />
              </button>

              {/* Menu Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-[100]">
                  <Link 
                    to="/profil" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profil Saya
                  </Link>
                  <Link 
                    to="/profil" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Riwayat Pembelian
                  </Link>
                  {user && user.is_staff && (
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-yellow-300 hover:bg-gray-700 font-bold hover:text-yellow-300"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  <div className="border-t border-gray-700 my-1"></div>
                  <button 
                    onClick={() => { 
                      logoutUser(); 
                      setIsDropdownOpen(false); 
                    }} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Tampilan Sebelum Login
            <>
              <Link to="/login" className="text-gray-400 hover:text-white">Login</Link>
              <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;