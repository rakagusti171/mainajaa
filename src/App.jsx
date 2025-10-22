import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Route Guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Halaman Publik
import HomePage from './pages/HomePage';
import SemuaAkunPage from './pages/SemuaAkunPage';
import AkunDetailPage from './pages/AkunDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; 
import ResetPasswordPage from './pages/ResetPasswordPage';
import TopUpPage from './pages/TopUpPage';
import TopUpDetailPage from './pages/TopUpDetailPage';

// Halaman User
import ProfilePage from './pages/ProfilePage';
import FavoritPage from './pages/FavoritPage';
import PaymentPage from './pages/PaymentPage';
import PurchaseDetailPage from './pages/PurchaseDetailPage';
import ReviewPage from './pages/ReviewPage';
import TopUpPaymentPage from './pages/TopUpPaymentPage';

// Halaman Admin 
import DashboardHomePage from './pages/admin/DashboardHomePage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import ProductAddChoicePage from './pages/admin/ProductAddChoicePage';
import ProductAddTopUpPage from './pages/admin/ProductAddTopUpPage';
import ProductAddAkunPage from './pages/admin/ProductAddAkunPage';
import ProductEditAkunPage from './pages/admin/ProductEditAkunPage';
import ProductEditTopUpPage from './pages/admin/ProductEditTopUpPage';
import ManageCouponsPage from './pages/admin/ManageCouponsPage';
import CouponAddPage from './pages/admin/CouponAddPage';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/*R ute Publik & User */}
          <Route path="/" element={<Layout />}>
            
            {/* Rute Publik */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="lupa-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password/:uid/:token" element={<ResetPasswordPage />} />
            <Route path="semua-akun" element={<SemuaAkunPage />} />
            <Route path="akun/:accountId" element={<AkunDetailPage />} />
            <Route path="top-up" element={<TopUpPage />} />
            <Route path="top-up/:productId" element={<TopUpDetailPage />} />

            {/* Rute User (Harus Login) */}
            <Route element={<PrivateRoute />}>
              <Route path="profil" element={<ProfilePage />} />
              <Route path="favorit" element={<FavoritPage />} />
              <Route path="bayar/:accountId" element={<PaymentPage />} />
              <Route path="top-up/bayar/:productId" element={<TopUpPaymentPage />} />
              <Route path="profil/pesanan/:kodeTransaksi" element={<PurchaseDetailPage />} />
              <Route path="pembelian/:purchaseId/ulasan" element={<ReviewPage />} />
            </Route>

          </Route>
          
          {/* Rute Admin  */}
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<AdminLayout />}>
              <Route index element={<DashboardHomePage />} />
              <Route path="pesanan" element={<ManageOrdersPage />} />
              <Route path="produk" element={<ManageProductsPage />} />
              <Route path="produk/tambah" element={<ProductAddChoicePage />} />
              <Route path="produk/tambah-topup" element={<ProductAddTopUpPage />} />
              <Route path="produk/tambah-akun" element={<ProductAddAkunPage />} />
              <Route path="produk/edit-akun/:id" element={<ProductEditAkunPage />} />
              <Route path="produk/edit-topup/:id" element={<ProductEditTopUpPage />} />
              <Route path="kupon" element={<ManageCouponsPage />} />
              <Route path="kupon/tambah" element={<CouponAddPage />} />
            </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;