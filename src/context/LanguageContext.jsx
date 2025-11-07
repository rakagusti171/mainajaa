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
    close: 'Tutup',
    // Products
    allAccounts: 'Semua Akun',
    favoriteAccounts: 'Akun Favorit',
    viewDetails: 'Lihat Detail',
    buyNow: 'Beli Sekarang',
    price: 'Harga',
    allGames: 'Semua Game',
    sortBy: 'Urutkan',
    newest: 'Terbaru',
    cheapest: 'Termurah',
    mostExpensive: 'Termahal',
    // Search
    searchPlaceholder: 'Cari akun atau top up...',
    searchResults: 'Hasil Pencarian',
    noResults: 'Tidak ada hasil',
    enterKeyword: 'Masukkan kata kunci untuk mencari produk',
    noResultsFor: 'Tidak ada hasil untuk',
    tryOtherKeyword: 'Coba gunakan kata kunci lain',
    // Pagination
    showing: 'Menampilkan',
    of: 'dari',
    accounts: 'akun',
    // 404
    notFound: 'Halaman Tidak Ditemukan',
    goHome: 'Kembali ke Home',
    pageNotFound: 'Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman telah dipindahkan atau dihapus.',
    viewAllAccounts: 'Lihat Semua Akun',
    // HomePage
    trusted: 'TERPERCAYA',
    gamingMarketplace: 'Marketplace',
    homeDescription: 'Platform jual beli akun gaming terpercaya di Indonesia. Dapatkan akun impian atau jual pencapaian gaming Anda dengan aman.',
    accountsSold: 'Akun Terjual',
    satisfaction: 'Kepuasan',
    support: 'Support',
    searchGamingAccount: 'Cari Akun Gaming',
    level: 'Level',
    noFeaturedAccount: 'Tidak ada akun unggulan saat ini.',
    failedToLoad: 'Gagal memuat data. Pastikan server backend berjalan.',
    // Stats
    accountsSoldCount: '15,000+',
    satisfactionRate: '98%',
    supportHours: '24/7',
    // Account Detail Page
    accountDescription: 'Deskripsi Akun',
    noDescription: 'Tidak ada deskripsi.',
    addToFavorites: 'Tambah ke Favorit',
    removeFromFavorites: 'Hapus dari Favorit',
    buyerProtection: 'Perlindungan Pembeli',
    moneyBackGuarantee: 'Garansi 100% Uang Kembali',
    secureTransaction: 'Transaksi Aman',
    customerReviews: 'Ulasan Pelanggan untuk',
    noReviews: 'Belum ada ulasan untuk game ini.',
    similarAccounts: 'Akun Serupa',
    noSimilarAccounts: 'Tidak ada akun serupa.',
    loadingAccount: 'Memuat akun...',
    accountNotFound: 'Akun tidak ditemukan.',
    // Payment Page
    checkout: 'Checkout Pembayaran',
    orderSummary: 'Ringkasan Pesanan',
    paymentMethod: 'Metode Pembayaran',
    couponCode: 'Kode Kupon (Opsional)',
    enterCouponCode: 'Masukkan kode kupon',
    apply: 'Terapkan',
    originalPrice: 'Harga Asli:',
    discount: 'Diskon',
    totalPay: 'Total Bayar:',
    payNow: 'Bayar Sekarang',
    processing: 'Memproses...',
    loadingCheckout: 'Memuat checkout...',
    failedToLoadAccount: 'Gagal memuat detail akun. Silakan coba lagi.',
    mustLogin: 'Anda harus login untuk melanjutkan.',
    accountSold: 'Gagal memuat detail akun. Mungkin akun sudah terjual.',
    paymentFailed: 'Gagal memuat script pembayaran. Coba refresh halaman.',
    accountDataNotLoaded: 'Data akun belum termuat.',
    paymentNotReady: 'Layanan pembayaran belum siap. Coba refresh halaman.',
    paymentSuccess: 'Pembayaran berhasil!',
    waitingPayment: 'Menunggu pembayaran Anda!',
    paymentFailedMsg: 'Pembayaran gagal!',
    paymentClosed: 'Anda menutup popup pembayaran.',
    invalidToken: 'Token Midtrans tidak diterima.',
    transactionFailed: 'Gagal membuat transaksi:',
    serverError: 'Terjadi kesalahan server.',
    couponInvalid: 'Kupon tidak valid.',
    couponApplied: 'Kupon berhasil diterapkan!',
    // Profile Page
    userProfile: 'Profil Pengguna',
    myProfile: 'Profil Saya',
    purchaseHistory: 'Riwayat Pembelian',
    favoriteAccounts: 'Akun Favorit',
    changePassword: 'Ubah Password',
    username: 'Username',
    email: 'Email',
    loadingHistory: 'Memuat riwayat...',
    noPurchaseHistory: 'Anda belum memiliki riwayat pembelian.',
    item: 'Item',
    date: 'Tanggal',
    total: 'Total',
    status: 'Status',
    action: 'Aksi',
    continuePayment: 'Lanjutkan Bayar',
    viewDetail: 'Lihat Detail',
    canceled: 'Dibatalkan',
    loadingFavorites: 'Memuat favorit...',
    noFavorites: 'Anda belum memiliki akun favorit.',
    oldPassword: 'Password Lama',
    newPassword: 'Password Baru',
    confirmNewPassword: 'Konfirmasi Password Baru',
    saving: 'Menyimpan...',
    saveChanges: 'Simpan Perubahan',
    passwordMismatch: 'Password baru tidak cocok.',
    passwordChanged: 'Password berhasil diubah!',
    passwordChangeFailed: 'Gagal mengubah password.',
    loggedOut: 'Anda telah logout.',
    loadingUser: 'Memuat data pengguna...',
    // Login/Register
    forgotPassword: 'Lupa password?',
    noAccount: 'Belum punya akun?',
    registerHere: 'Daftar di sini',
    loginSuccess: 'Login berhasil!',
    loginFailed: 'Login Gagal: Username atau password salah.',
    createAccount: 'Create Account',
    confirmPassword: 'Confirm Password',
    alreadyHaveAccount: 'Already have an account?',
    // Top Up Page
    topUpGame: 'Top Up Game',
    noTopUpProducts: 'Tidak ada produk top up yang ditemukan untuk game ini.',
    // Favorites Page
    myFavoriteAccounts: 'Akun Favorit Saya',
    failedToLoadFavorites: 'Gagal memuat akun favorit.',
    removedFromFavorites: 'Dihapus dari favorit.',
    failedToRemoveFavorite: 'Gagal menghapus favorit.',
    exploreAllAccounts: 'Jelajahi semua akun',
    // Search Page
    searchResultsFor: 'Hasil Pencarian:',
    all: 'Semua',
    account: 'Akun',
    gamingAccounts: 'Akun Gaming',
    topUpProducts: 'Produk Top Up',
    // Common Messages
    failedToLoadAccounts: 'Gagal memuat akun. Pastikan backend berjalan.',
    noAccountsFound: 'Tidak ada akun yang ditemukan.',
    imageNotAvailable: 'Gambar tidak tersedia',
    password: 'Password',
    hi: 'Hi',
    adminDashboard: 'Dashboard Admin',
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
    close: 'Close',
    // Products
    allAccounts: 'All Accounts',
    favoriteAccounts: 'Favorite Accounts',
    viewDetails: 'View Details',
    buyNow: 'Buy Now',
    price: 'Price',
    allGames: 'All Games',
    sortBy: 'Sort',
    newest: 'Newest',
    cheapest: 'Cheapest',
    mostExpensive: 'Most Expensive',
    // Search
    searchPlaceholder: 'Search accounts or top up...',
    searchResults: 'Search Results',
    noResults: 'No results found',
    enterKeyword: 'Enter keyword to search products',
    noResultsFor: 'No results for',
    tryOtherKeyword: 'Try using different keywords',
    // Pagination
    showing: 'Showing',
    of: 'of',
    accounts: 'accounts',
    // 404
    notFound: 'Page Not Found',
    goHome: 'Back to Home',
    pageNotFound: 'Sorry, the page you are looking for was not found. The page may have been moved or deleted.',
    viewAllAccounts: 'View All Accounts',
    // HomePage
    trusted: 'TRUSTED',
    gamingMarketplace: 'Marketplace',
    homeDescription: 'Trusted gaming account buying and selling platform in Indonesia. Get your dream account or sell your gaming achievements safely.',
    accountsSold: 'Accounts Sold',
    satisfaction: 'Satisfaction',
    support: 'Support',
    searchGamingAccount: 'Search Gaming Account',
    level: 'Level',
    noFeaturedAccount: 'No featured account available at the moment.',
    failedToLoad: 'Failed to load data. Please make sure the backend server is running.',
    // Stats
    accountsSoldCount: '15,000+',
    satisfactionRate: '98%',
    supportHours: '24/7',
    // Account Detail Page
    accountDescription: 'Account Description',
    noDescription: 'No description available.',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    buyerProtection: 'Buyer Protection',
    moneyBackGuarantee: '100% Money Back Guarantee',
    secureTransaction: 'Secure Transaction',
    customerReviews: 'Customer Reviews for',
    noReviews: 'No reviews for this game yet.',
    similarAccounts: 'Similar Accounts',
    noSimilarAccounts: 'No similar accounts found.',
    loadingAccount: 'Loading account...',
    accountNotFound: 'Account not found.',
    // Payment Page
    checkout: 'Checkout Payment',
    orderSummary: 'Order Summary',
    paymentMethod: 'Payment Method',
    couponCode: 'Coupon Code (Optional)',
    enterCouponCode: 'Enter coupon code',
    apply: 'Apply',
    originalPrice: 'Original Price:',
    discount: 'Discount',
    totalPay: 'Total Pay:',
    payNow: 'Pay Now',
    processing: 'Processing...',
    loadingCheckout: 'Loading checkout...',
    failedToLoadAccount: 'Failed to load account details. Please try again.',
    mustLogin: 'You must login to continue.',
    accountSold: 'Failed to load account details. The account may have been sold.',
    paymentFailed: 'Failed to load payment script. Please refresh the page.',
    accountDataNotLoaded: 'Account data not loaded yet.',
    paymentNotReady: 'Payment service not ready. Please refresh the page.',
    paymentSuccess: 'Payment successful!',
    waitingPayment: 'Waiting for your payment!',
    paymentFailedMsg: 'Payment failed!',
    paymentClosed: 'You closed the payment popup.',
    invalidToken: 'Midtrans token not received.',
    transactionFailed: 'Failed to create transaction:',
    serverError: 'Server error occurred.',
    couponInvalid: 'Invalid coupon.',
    couponApplied: 'Coupon applied successfully!',
    // Profile Page
    userProfile: 'User Profile',
    myProfile: 'My Profile',
    purchaseHistory: 'Purchase History',
    favoriteAccounts: 'Favorite Accounts',
    changePassword: 'Change Password',
    username: 'Username',
    email: 'Email',
    loadingHistory: 'Loading history...',
    noPurchaseHistory: 'You have no purchase history yet.',
    item: 'Item',
    date: 'Date',
    total: 'Total',
    status: 'Status',
    action: 'Action',
    continuePayment: 'Continue Payment',
    viewDetail: 'View Detail',
    canceled: 'Canceled',
    loadingFavorites: 'Loading favorites...',
    noFavorites: 'You have no favorite accounts yet.',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    saving: 'Saving...',
    saveChanges: 'Save Changes',
    passwordMismatch: 'New passwords do not match.',
    passwordChanged: 'Password changed successfully!',
    passwordChangeFailed: 'Failed to change password.',
    loggedOut: 'You have logged out.',
    loadingUser: 'Loading user data...',
    // Login/Register
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    registerHere: 'Register here',
    loginSuccess: 'Login successful!',
    loginFailed: 'Login Failed: Username or password is incorrect.',
    createAccount: 'Create Account',
    confirmPassword: 'Confirm Password',
    alreadyHaveAccount: 'Already have an account?',
    // Top Up Page
    topUpGame: 'Top Up Game',
    noTopUpProducts: 'No top up products found for this game.',
    // Favorites Page
    myFavoriteAccounts: 'My Favorite Accounts',
    failedToLoadFavorites: 'Failed to load favorite accounts.',
    removedFromFavorites: 'Removed from favorites.',
    failedToRemoveFavorite: 'Failed to remove favorite.',
    exploreAllAccounts: 'Explore all accounts',
    // Search Page
    searchResultsFor: 'Search Results:',
    all: 'All',
    account: 'Account',
    gamingAccounts: 'Gaming Accounts',
    topUpProducts: 'Top Up Products',
    // Common Messages
    failedToLoadAccounts: 'Failed to load accounts. Please make sure backend is running.',
    noAccountsFound: 'No accounts found.',
    imageNotAvailable: 'Image not available',
    password: 'Password',
    hi: 'Hi',
    adminDashboard: 'Admin Dashboard',
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

