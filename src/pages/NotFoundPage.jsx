import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl sm:text-8xl font-bold mb-4 text-purple-400">404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-8 text-sm sm:text-base">
          Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman telah dipindahkan atau dihapus.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
          >
            Kembali ke Home
          </Link>
          <Link
            to="/semua-akun"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition-colors"
          >
            Lihat Semua Akun
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;

