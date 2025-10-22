import React from 'react';
import { Link } from 'react-router-dom';

function ProductAddChoicePage() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Tambah Produk Baru</h1>
      <p className="text-gray-400 mb-8">Pilih tipe produk yang ingin Anda tambahkan:</p>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Link 
          to="/dashboard/produk/tambah-akun" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors flex-1"
        >
          <h2 className="text-xl mb-1">Akun Gaming</h2>
          <p className="text-sm text-purple-200">Tambahkan akun game baru untuk dijual.</p>
        </Link>
        
        <Link 
          to="/dashboard/produk/tambah-topup" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors flex-1"
        >
          <h2 className="text-xl mb-1">Produk Top Up</h2>
          <p className="text-sm text-blue-200">Tambahkan paket top up baru.</p>
        </Link>
      </div>
       <div className="mt-8">
            <Link 
                to="/dashboard/produk" 
                className="text-gray-400 hover:text-white"
            >
                &larr; Kembali ke Kelola Produk
            </Link>
       </div>
    </div>
  );
}

export default ProductAddChoicePage;