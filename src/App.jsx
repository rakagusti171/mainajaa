import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Route Guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Error Handling
import ErrorBoundary from './components/ErrorBoundary';

// Code splitting with React.lazy for better performance
import { lazy, Suspense } from 'react';
import { ProductCardSkeleton } from './components/LoadingSkeleton';

// Halaman Publik - Lazy loaded
const HomePage = lazy(() => import('./pages/HomePage'));
const SemuaAkunPage = lazy(() => import('./pages/SemuaAkunPage'));
const AkunDetailPage = lazy(() => import('./pages/AkunDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const TopUpPage = lazy(() => import('./pages/TopUpPage'));
const TopUpDetailPage = lazy(() => import('./pages/TopUpDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

// Halaman User - Lazy loaded
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const FavoritPage = lazy(() => import('./pages/FavoritPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const PurchaseDetailPage = lazy(() => import('./pages/PurchaseDetailPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const TopUpPaymentPage = lazy(() => import('./pages/TopUpPaymentPage'));
const CartPage = lazy(() => import('./pages/CartPage'));

// Halaman Admin - Lazy loaded
const DashboardHomePage = lazy(() => import('./pages/admin/DashboardHomePage'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const ManageOrdersPage = lazy(() => import('./pages/admin/ManageOrdersPage'));
const ManageProductsPage = lazy(() => import('./pages/admin/ManageProductsPage'));
const ProductAddChoicePage = lazy(() => import('./pages/admin/ProductAddChoicePage'));
const ProductAddTopUpPage = lazy(() => import('./pages/admin/ProductAddTopUpPage'));
const ProductAddAkunPage = lazy(() => import('./pages/admin/ProductAddAkunPage'));
const ProductEditAkunPage = lazy(() => import('./pages/admin/ProductEditAkunPage'));
const ProductEditTopUpPage = lazy(() => import('./pages/admin/ProductEditTopUpPage'));
const ManageCouponsPage = lazy(() => import('./pages/admin/ManageCouponsPage'));
const CouponAddPage = lazy(() => import('./pages/admin/CouponAddPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
      <p className="text-gray-400">Memuat halaman...</p>
    </div>
  </div>
);


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <AuthProvider>
              <CartProvider>
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
            <Route index element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
            <Route path="login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
            <Route path="register" element={<Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>} />
            <Route path="lupa-password" element={<Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense>} />
            <Route path="reset-password/:uid/:token" element={<Suspense fallback={<PageLoader />}><ResetPasswordPage /></Suspense>} />
            <Route path="search" element={<Suspense fallback={<PageLoader />}><SearchPage /></Suspense>} />
            <Route path="semua-akun" element={<Suspense fallback={<PageLoader />}><SemuaAkunPage /></Suspense>} />
            <Route path="akun/:accountId" element={<Suspense fallback={<PageLoader />}><AkunDetailPage /></Suspense>} />
            <Route path="top-up" element={<Suspense fallback={<PageLoader />}><TopUpPage /></Suspense>} />
            <Route path="top-up/:productId" element={<Suspense fallback={<PageLoader />}><TopUpDetailPage /></Suspense>} />

            {/* Rute User (Harus Login) */}
            <Route element={<PrivateRoute />}>
              <Route path="profil" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
              <Route path="favorit" element={<Suspense fallback={<PageLoader />}><FavoritPage /></Suspense>} />
              <Route path="cart" element={<Suspense fallback={<PageLoader />}><CartPage /></Suspense>} />
              <Route path="bayar/:accountId" element={<Suspense fallback={<PageLoader />}><PaymentPage /></Suspense>} />
              <Route path="top-up/bayar/:productId" element={<Suspense fallback={<PageLoader />}><TopUpPaymentPage /></Suspense>} />
              <Route path="profil/pesanan/:kodeTransaksi" element={<Suspense fallback={<PageLoader />}><PurchaseDetailPage /></Suspense>} />
              <Route path="pembelian/:purchaseId/ulasan" element={<Suspense fallback={<PageLoader />}><ReviewPage /></Suspense>} />
            </Route>

          </Route>
          
          {/* Rute Admin  */}
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<AdminLayout />}>
              <Route index element={<Suspense fallback={<PageLoader />}><DashboardHomePage /></Suspense>} />
              <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
              <Route path="pesanan" element={<Suspense fallback={<PageLoader />}><ManageOrdersPage /></Suspense>} />
              <Route path="produk" element={<Suspense fallback={<PageLoader />}><ManageProductsPage /></Suspense>} />
              <Route path="produk/tambah" element={<Suspense fallback={<PageLoader />}><ProductAddChoicePage /></Suspense>} />
              <Route path="produk/tambah-topup" element={<Suspense fallback={<PageLoader />}><ProductAddTopUpPage /></Suspense>} />
              <Route path="produk/tambah-akun" element={<Suspense fallback={<PageLoader />}><ProductAddAkunPage /></Suspense>} />
              <Route path="produk/edit-akun/:id" element={<Suspense fallback={<PageLoader />}><ProductEditAkunPage /></Suspense>} />
              <Route path="produk/edit-topup/:id" element={<Suspense fallback={<PageLoader />}><ProductEditTopUpPage /></Suspense>} />
              <Route path="kupon" element={<Suspense fallback={<PageLoader />}><ManageCouponsPage /></Suspense>} />
              <Route path="kupon/tambah" element={<Suspense fallback={<PageLoader />}><CouponAddPage /></Suspense>} />
            </Route>
          </Route>

          {/* 404 Route - Harus di akhir */}
          <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>} />
        </Routes>
      </CartProvider>
      </AuthProvider>
    </Router>
    </LanguageProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}
export default App;