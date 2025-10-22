// frontend/src/components/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // <-- Impor ikon

// Ikon panah kecil untuk dropdown
const ChevronDownIcon = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
  </svg>
);

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <-- State baru untuk menu HP

  // Fungsi untuk menutup kedua menu
  const closeAllMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    // Navbar dibuat 'sticky' dan 'z-40' (di bawah dropdown z-50)
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* 1. Logo */}
        <Link to="/" onClick={closeAllMenus} className="text-2xl font-bold text-white hover:text-purple-400">
          Mainajaa
        </Link>

        {/* 2. Link Desktop (Sembunyi di HP) */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white font-semibold">Home</Link>
          <Link to="/semua-akun" className="text-gray-400 hover:text-white">Beli Akun</Link>
          <Link to="/top-up" className="text-gray-400 hover:text-white">Top Up</Link>
        </div>

        {/* 3. Tombol Login/Register & Dropdown (Sembunyi di HP) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            // Dropdown User
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-white hover:text-purple-400 font-semibold focus:outline-none"
              >
                Hi, {user.username}
                <ChevronDownIcon />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  <Link to="/profil" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Profil Saya</Link>
                  {user && user.is_staff && (
                    <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-yellow-300 font-bold hover:text-yellow-300">Dashboard Admin</Link>
                  )}
                  <div className="border-t border-gray-700 my-1"></div>
                  <button onClick={() => { logoutUser(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Tombol Login/Register
            <>
              <Link to="/login" className="text-gray-400 hover:text-white">Login</Link>
              <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">
                Register
              </Link>
            </>
          )}
        </div>

        {/* 4. Tombol Hamburger (HANYA MUNCUL DI HP) */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-8 h-8" />
            ) : (
              <Bars3Icon className="w-8 h-8" />
            )}
          </button>
        </div>

      </div>

      {/* 5. Menu Dropdown HP (MUNCUL SAAT DIKLIK) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col px-6 pt-2 pb-6 space-y-3">
            {/* Link Navigasi HP */}
            <Link to="/" onClick={closeAllMenus} className="text-gray-300 hover:text-white font-semibold block py-2">Home</Link>
            <Link to="/semua-akun" onClick={closeAllMenus} className="text-gray-400 hover:text-white block py-2">Beli Akun</Link>
            <Link to="/top-up" onClick={closeAllMenus} className="text-gray-400 hover:text-white block py-2">Top Up</Link>

            <div className="border-t border-gray-700 pt-4 space-y-3">
              {/* Tombol Login/User HP */}
              {user ? (
                <>
                  <Link to="/profil" onClick={closeAllMenus} className="block text-white font-semibold">Profil (Hi, {user.username})</Link>
                  {user.is_staff && (
                    <Link to="/dashboard" onClick={closeAllMenus} className="block text-yellow-300 font-bold">Dashboard Admin</Link>
                  )}
                  <button onClick={() => { logoutUser(); closeAllMenus(); }} className="block w-full text-left text-red-400">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeAllMenus} className="text-gray-400 hover:text-white block">Login</Link>
                  <Link to="/register" onClick={closeAllMenus} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md block text-center">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;