import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  id: {
    // Navigation
    home: 'Home',
    buyAccount: 'Beli Akun',
    topUp: 'Top Up',
    search: 'Cari',
    login: 'Login',
    register: 'Register',
    profile: 'Profil',
    logout: 'Logout',
    // Common
    loading: 'Memuat...',
    error: 'Terjadi kesalahan',
    success: 'Berhasil',
    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Hapus',
    edit: 'Edit',
    // Products
    allAccounts: 'Semua Akun',
    favoriteAccounts: 'Akun Favorit',
    viewDetails: 'Lihat Detail',
    buyNow: 'Beli Sekarang',
    price: 'Harga',
    // Search
    searchPlaceholder: 'Cari akun atau top up...',
    searchResults: 'Hasil Pencarian',
    noResults: 'Tidak ada hasil',
    // Pagination
    showing: 'Menampilkan',
    of: 'dari',
    // 404
    notFound: 'Halaman Tidak Ditemukan',
    goHome: 'Kembali ke Home',
  },
  en: {
    // Navigation
    home: 'Home',
    buyAccount: 'Buy Account',
    topUp: 'Top Up',
    search: 'Search',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    logout: 'Logout',
    // Common
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    // Products
    allAccounts: 'All Accounts',
    favoriteAccounts: 'Favorite Accounts',
    viewDetails: 'View Details',
    buyNow: 'Buy Now',
    price: 'Price',
    // Search
    searchPlaceholder: 'Search accounts or top up...',
    searchResults: 'Search Results',
    noResults: 'No results found',
    // Pagination
    showing: 'Showing',
    of: 'of',
    // 404
    notFound: 'Page Not Found',
    goHome: 'Back to Home',
  },
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'id';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

