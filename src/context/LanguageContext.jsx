import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Translation dictionary
const translations = {
  id: {
    // HomePage
    trusted: 'Terpercaya',
    gamingMarketplace: 'Marketplace Gaming',
    homeDescription: 'Temukan akun gaming berkualitas tinggi dengan harga terbaik. Dari akun level tinggi hingga akun langka, semua tersedia di sini.',
    accountsSoldCount: 'Akun Terjual',
    accountsSold: 'Akun Terjual',
    satisfactionRate: 'Tingkat Kepuasan',
    satisfaction: 'Tingkat Kepuasan',
    supportHours: 'Dukungan 24/7',
    support: 'Dukungan 24/7',
    searchGamingAccount: 'Cari Akun Gaming',
    noFeaturedAccount: 'Tidak ada akun unggulan',
    failedToLoad: 'Gagal memuat data',
    
    // Auth
    loginSuccess: 'Login berhasil!',
    loginFailed: 'Login gagal. Periksa kredensial Anda.',
    
    // Common
    loading: 'Memuat...',
    error: 'Terjadi kesalahan',
    success: 'Berhasil',
    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Hapus',
    edit: 'Edit',
    add: 'Tambah',
    search: 'Cari',
    filter: 'Filter',
    sort: 'Urutkan',
    price: 'Harga',
    stock: 'Stok',
    buy: 'Beli',
    addToCart: 'Tambah ke Keranjang',
    addToFavorites: 'Tambah ke Favorit',
    removeFromFavorites: 'Hapus dari Favorit',
    viewDetails: 'Lihat Detail',
    
    // Navigation
    home: 'Beranda',
    accounts: 'Akun',
    topUp: 'Top Up',
    profile: 'Profil',
    favorites: 'Favorit',
    cart: 'Keranjang',
    orders: 'Pesanan',
    logout: 'Keluar',
    login: 'Masuk',
    register: 'Daftar',
    
    // Payment
    paymentMethod: 'Metode Pembayaran',
    total: 'Total',
    checkout: 'Checkout',
    payNow: 'Bayar Sekarang',
    paymentSuccess: 'Pembayaran berhasil!',
    paymentFailed: 'Pembayaran gagal',
    
    // Profile
    myProfile: 'Profil Saya',
    myOrders: 'Pesanan Saya',
    accountSettings: 'Pengaturan Akun',
    changePassword: 'Ubah Password',
    
    // Not Found
    pageNotFound: 'Halaman Tidak Ditemukan',
    goHome: 'Kembali ke Beranda',
    
    // Navbar & Search
    searchPlaceholder: 'Cari game, akun, atau top up...',
    buyAccount: 'Beli Akun',
    hi: 'Halo',
    adminDashboard: 'Dashboard Admin',
    
    // Accounts
    failedToLoadAccounts: 'Gagal memuat daftar akun',
    allAccounts: 'Semua Akun',
    accountNotFound: 'Akun tidak ditemukan',
    loadingAccount: 'Memuat detail akun...',
    accountDescription: 'Deskripsi Akun',
    noDescription: 'Tidak ada deskripsi',
    level: 'Level',
    buyNow: 'Beli Sekarang',
    buyerProtection: 'Perlindungan Pembeli',
    moneyBackGuarantee: 'Garansi uang kembali 100%',
    secureTransaction: 'Transaksi aman dan terenkripsi',
    customerReviews: 'Ulasan Pelanggan',
    noReviews: 'Belum ada ulasan',
    similarAccounts: 'Akun Serupa',
    noSimilarAccounts: 'Tidak ada akun serupa',
    close: 'Tutup',
    
    // Payment & Checkout
    mustLogin: 'Anda harus login terlebih dahulu',
    accountSold: 'Akun ini sudah terjual',
    accountDataNotLoaded: 'Data akun tidak dapat dimuat',
    couponApplied: 'Kupon berhasil diterapkan!',
    couponInvalid: 'Kupon tidak valid atau sudah digunakan',
    paymentNotReady: 'Pembayaran belum siap',
    waitingPayment: 'Menunggu pembayaran Anda...',
    paymentFailedMsg: 'Pembayaran gagal atau dibatalkan',
    paymentClosed: 'Pembayaran ditutup',
    invalidToken: 'Token pembayaran tidak valid',
    transactionFailed: 'Transaksi gagal',
    serverError: 'Kesalahan server',
    loadingCheckout: 'Memuat halaman checkout...',
    failedToLoadAccount: 'Gagal memuat data akun',
    orderSummary: 'Ringkasan Pesanan',
    couponCode: 'Kode Kupon',
    enterCouponCode: 'Masukkan kode kupon',
    apply: 'Terapkan',
    originalPrice: 'Harga Asli',
    discount: 'Diskon',
    totalPay: 'Total Pembayaran',
    processing: 'Memproses...',
    continuePayment: 'Lanjutkan Pembayaran',
    viewDetail: 'Lihat Detail',
    canceled: 'Dibatalkan',
    
    // Profile
    loadingUser: 'Memuat data pengguna...',
    username: 'Username',
    email: 'Email',
    purchaseHistory: 'Riwayat Pembelian',
    loadingHistory: 'Memuat riwayat pembelian...',
    noPurchaseHistory: 'Belum ada riwayat pembelian',
    item: 'Item',
    date: 'Tanggal',
    status: 'Status',
    action: 'Aksi',
    failedToLoadFavorites: 'Gagal memuat favorit',
    loadingFavorites: 'Memuat favorit...',
    noFavorites: 'Belum ada akun favorit',
    passwordMismatch: 'Password baru tidak cocok',
    passwordChanged: 'Password berhasil diubah!',
    passwordChangeFailed: 'Gagal mengubah password',
    oldPassword: 'Password Lama',
    newPassword: 'Password Baru',
    confirmNewPassword: 'Konfirmasi Password Baru',
    saving: 'Menyimpan...',
    saveChanges: 'Simpan Perubahan',
    loggedOut: 'Anda telah logout',
    userProfile: 'Profil Pengguna',
    favoriteAccounts: 'Akun Favorit',
  },
  en: {
    // HomePage
    trusted: 'Trusted',
    gamingMarketplace: 'Gaming Marketplace',
    homeDescription: 'Find high-quality gaming accounts at the best prices. From high-level accounts to rare accounts, everything is available here.',
    accountsSoldCount: 'Accounts Sold',
    accountsSold: 'Accounts Sold',
    satisfactionRate: 'Satisfaction Rate',
    satisfaction: 'Satisfaction Rate',
    supportHours: '24/7 Support',
    support: '24/7 Support',
    searchGamingAccount: 'Search Gaming Account',
    noFeaturedAccount: 'No featured account',
    failedToLoad: 'Failed to load data',
    
    // Auth
    loginSuccess: 'Login successful!',
    loginFailed: 'Login failed. Please check your credentials.',
    
    // Common
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    price: 'Price',
    stock: 'Stock',
    buy: 'Buy',
    addToCart: 'Add to Cart',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    viewDetails: 'View Details',
    
    // Navigation
    home: 'Home',
    accounts: 'Accounts',
    topUp: 'Top Up',
    profile: 'Profile',
    favorites: 'Favorites',
    cart: 'Cart',
    orders: 'Orders',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    
    // Payment
    paymentMethod: 'Payment Method',
    total: 'Total',
    checkout: 'Checkout',
    payNow: 'Pay Now',
    paymentSuccess: 'Payment successful!',
    paymentFailed: 'Payment failed',
    
    // Profile
    myProfile: 'My Profile',
    myOrders: 'My Orders',
    accountSettings: 'Account Settings',
    changePassword: 'Change Password',
    
    // Not Found
    pageNotFound: 'Page Not Found',
    goHome: 'Go Home',
    
    // Navbar & Search
    searchPlaceholder: 'Search games, accounts, or top up...',
    buyAccount: 'Buy Account',
    hi: 'Hi',
    adminDashboard: 'Admin Dashboard',
    
    // Accounts
    failedToLoadAccounts: 'Failed to load accounts list',
    allAccounts: 'All Accounts',
    accountNotFound: 'Account not found',
    loadingAccount: 'Loading account details...',
    accountDescription: 'Account Description',
    noDescription: 'No description available',
    level: 'Level',
    buyNow: 'Buy Now',
    buyerProtection: 'Buyer Protection',
    moneyBackGuarantee: '100% Money Back Guarantee',
    secureTransaction: 'Secure and encrypted transaction',
    customerReviews: 'Customer Reviews',
    noReviews: 'No reviews yet',
    similarAccounts: 'Similar Accounts',
    noSimilarAccounts: 'No similar accounts',
    close: 'Close',
    
    // Payment & Checkout
    mustLogin: 'You must login first',
    accountSold: 'This account is already sold',
    accountDataNotLoaded: 'Account data could not be loaded',
    couponApplied: 'Coupon applied successfully!',
    couponInvalid: 'Invalid or already used coupon',
    paymentNotReady: 'Payment is not ready',
    waitingPayment: 'Waiting for your payment...',
    paymentFailedMsg: 'Payment failed or canceled',
    paymentClosed: 'Payment closed',
    invalidToken: 'Invalid payment token',
    transactionFailed: 'Transaction failed',
    serverError: 'Server error',
    loadingCheckout: 'Loading checkout page...',
    failedToLoadAccount: 'Failed to load account data',
    orderSummary: 'Order Summary',
    couponCode: 'Coupon Code',
    enterCouponCode: 'Enter coupon code',
    apply: 'Apply',
    originalPrice: 'Original Price',
    discount: 'Discount',
    totalPay: 'Total Payment',
    processing: 'Processing...',
    continuePayment: 'Continue Payment',
    viewDetail: 'View Detail',
    canceled: 'Canceled',
    
    // Profile
    loadingUser: 'Loading user data...',
    username: 'Username',
    email: 'Email',
    purchaseHistory: 'Purchase History',
    loadingHistory: 'Loading purchase history...',
    noPurchaseHistory: 'No purchase history yet',
    item: 'Item',
    date: 'Date',
    status: 'Status',
    action: 'Action',
    failedToLoadFavorites: 'Failed to load favorites',
    loadingFavorites: 'Loading favorites...',
    noFavorites: 'No favorite accounts yet',
    passwordMismatch: 'New passwords do not match',
    passwordChanged: 'Password changed successfully!',
    passwordChangeFailed: 'Failed to change password',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    saving: 'Saving...',
    saveChanges: 'Save Changes',
    loggedOut: 'You have been logged out',
    userProfile: 'User Profile',
    favoriteAccounts: 'Favorite Accounts',
  },
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, then browser language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'id' || savedLanguage === 'en')) {
      return savedLanguage;
    }
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('id')) {
      return 'id';
    }
    return 'en'; // Default to English
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (lang) => {
    if (lang === 'id' || lang === 'en') {
      setLanguage(lang);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

