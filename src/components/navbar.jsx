// frontend/src/components/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

// Ikon panah kecil untuk dropdown
const ChevronDownIcon = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
  </svg>
);

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fungsi untuk menutup kedua menu
  const closeAllMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      closeAllMenus();
    }
  };

  return (
    // Navbar dibuat 'sticky' dan 'z-40' (di bawah dropdown z-50)
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-4">
          
          {/* 1. Logo */}
          <Link to="/" onClick={closeAllMenus} className="text-xl sm:text-2xl font-bold text-white hover:text-purple-400 flex-shrink-0">
            Mainajaa
          </Link>

          {/* 2. Search Bar Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                aria-label="Search products"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* 3. Link Desktop (Sembunyi di HP) */}
          <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
            <Link to="/" className="text-gray-300 hover:text-white font-semibold" aria-label={t('home')}>{t('home')}</Link>
            <Link to="/semua-akun" className="text-gray-400 hover:text-white" aria-label={t('buyAccount')}>{t('buyAccount')}</Link>
            <Link to="/top-up" className="text-gray-400 hover:text-white" aria-label={t('topUp')}>{t('topUp')}</Link>
          </div>

          {/* 4. Theme & Language Toggles (Desktop) */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* 5. Tombol Login/Register & Dropdown (Sembunyi di HP) */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
          {user ? (
            // Dropdown User
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-white hover:text-purple-400 font-semibold focus:outline-none"
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
              >
                {t('hi')}, {user.username}
                <ChevronDownIcon />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  <Link to="/profil" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" aria-label={t('profile')}>{t('profile')}</Link>
                  {user && user.is_staff && (
                    <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-yellow-300 font-bold hover:text-yellow-300">{t('adminDashboard')}</Link>
                  )}
                  <div className="border-t border-gray-700 my-1"></div>
                  <button onClick={() => { logoutUser(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300" aria-label={t('logout')}>
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Tombol Login/Register
            <>
              <Link to="/login" className="text-gray-400 hover:text-white" aria-label={t('login')}>{t('login')}</Link>
              <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md" aria-label={t('register')}>
                {t('register')}
              </Link>
            </>
          )}
          </div>

          {/* 5. Search & Hamburger Mobile */}
          <div className="md:hidden flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-1"
              aria-label="Toggle search"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="md:hidden mt-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                aria-label="Search products"
                autoFocus
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>
        )}
      </div>

      {/* 6. Menu Dropdown HP (MUNCUL SAAT DIKLIK) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col px-4 sm:px-6 pt-2 pb-4 sm:pb-6 space-y-3">
            {/* Link Navigasi HP */}
            <Link to="/" onClick={closeAllMenus} className="text-gray-300 hover:text-white font-semibold block py-2" aria-label={t('home')}>{t('home')}</Link>
            <Link to="/semua-akun" onClick={closeAllMenus} className="text-gray-400 hover:text-white block py-2" aria-label={t('buyAccount')}>{t('buyAccount')}</Link>
            <Link to="/top-up" onClick={closeAllMenus} className="text-gray-400 hover:text-white block py-2" aria-label={t('topUp')}>{t('topUp')}</Link>

            <div className="border-t border-gray-700 pt-4 space-y-3">
              {/* Theme & Language Toggles (Mobile) */}
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <LanguageToggle />
              </div>

              {/* Tombol Login/User HP */}
              {user ? (
                <>
                  <Link to="/profil" onClick={closeAllMenus} className="block text-white font-semibold">{t('profile')} ({t('hi')}, {user.username})</Link>
                  {user.is_staff && (
                    <Link to="/dashboard" onClick={closeAllMenus} className="block text-yellow-300 font-bold">{t('adminDashboard')}</Link>
                  )}
                  <button onClick={() => { logoutUser(); closeAllMenus(); }} className="block w-full text-left text-red-400" aria-label={t('logout')}>
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeAllMenus} className="text-gray-400 hover:text-white block" aria-label={t('login')}>{t('login')}</Link>
                  <Link to="/register" onClick={closeAllMenus} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md block text-center" aria-label={t('register')}>
                    {t('register')}
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