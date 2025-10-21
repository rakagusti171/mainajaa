// frontend/src/components/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const baseClass = "block px-4 py-2 rounded-md font-semibold";

  const getLinkClass = (path, exact = false) => {
    // Sedikit modifikasi agar path child juga aktif (misal /dashboard/produk aktif saat di /dashboard/produk/tambah)
    const isActive = exact ? currentPath === path : currentPath.startsWith(path);
    if (isActive) {
      return `${baseClass} bg-purple-600 text-white`;
    }
    return `${baseClass} text-gray-300 hover:bg-gray-700`;
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Panel</h2>
        <nav className="space-y-2 flex-grow">
          {/* Gunakan exact=true untuk Dashboard */}
          <Link to="/dashboard" className={getLinkClass('/dashboard', true)}>
            Dashboard
          </Link>
          <Link to="/dashboard/pesanan" className={getLinkClass('/dashboard/pesanan')}>
            Kelola Pesanan
          </Link>
          <Link to="/dashboard/produk" className={getLinkClass('/dashboard/produk')}>
            Kelola Produk
          </Link>
          
          {/* --- TAMBAHKAN LINK BARU DI SINI --- */}
          <Link to="/dashboard/kupon" className={getLinkClass('/dashboard/kupon')}>
            Kelola Kupon
          </Link>

        </nav>
        {/* Pindahkan Link kembali ke bawah agar tetap di bawah */}
        <div className="mt-auto pt-4 border-t border-gray-600">
             <Link
                to="/"
                className="block px-4 py-2 rounded-md font-semibold text-gray-400 hover:bg-gray-700"
            >
                &larr; Kembali ke Situs
            </Link>
        </div>
      </aside>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;