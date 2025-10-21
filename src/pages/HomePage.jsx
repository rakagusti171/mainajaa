import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

function HomePage() {
  const [akunUnggulan, setAkunUnggulan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Statistik ini bisa dibuat dinamis nanti jika perlu
  const stats = {
    akunTerjual: '15,000+',
    kepuasan: '98%',
    support: '24/7',
  };

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        // Ambil semua akun dari API
        const response = await apiClient.get('/accounts/');
        // Untuk sekarang, kita anggap akun pertama adalah akun unggulan
        if (response.data && response.data.length > 0) {
          setAkunUnggulan(response.data[0]);
        }
      } catch (err) {
        setError('Gagal memuat data. Pastikan server backend berjalan.');
        console.error("Gagal memuat data unggulan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ================================== */}
        {/* KOLOM KIRI: TEKS & CTA         */}
        {/* ================================== */}
        <div>
          <span className="inline-block bg-purple-600/20 text-purple-300 text-sm font-semibold px-4 py-1 rounded-full">
            TERPERCAYA
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-white mt-4 leading-tight">
            Mainajaa Gaming
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-purple-400">
            Marketplace
          </h2>

          <p className="mt-6 text-lg text-gray-400">
            Platform jual beli akun gaming terpercaya di Indonesia. Dapatkan akun impian atau jual pencapaian gaming Anda dengan aman.
          </p>

          <div className="flex space-x-8 mt-8">
            <div>
              <p className="text-3xl font-bold text-white">{stats.akunTerjual}</p>
              <p className="text-sm text-gray-500">Akun Terjual</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.kepuasan}</p>
              <p className="text-sm text-gray-500">Kepuasan</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.support}</p>
              <p className="text-sm text-gray-500">Support</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-10">
            <Link to="/semua-akun" className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors">
              Cari Akun Gaming
            </Link>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="text-center p-10">Memuat...</div>
          ) : error ? (
             <div className="text-center p-10 text-red-400">{error}</div>
          ) : akunUnggulan ? (
            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/30 border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <img src={akunUnggulan.gambar} className="w-full h-64 object-cover rounded-lg mb-4" alt={akunUnggulan.nama_akun} />

              <div className="flex justify-between items-center mb-2">
                <span className="bg-gray-800 text-gray-300 text-xs font-semibold px-2.5 py-1 rounded">{akunUnggulan.game}</span>
                <span className="text-gray-400 text-sm">Level {akunUnggulan.level}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mt-4">{akunUnggulan.nama_akun}</h3>
              <p className="text-3xl font-bold text-purple-400 mt-2">Rp {parseFloat(akunUnggulan.harga).toLocaleString('id-ID')}</p>

              <Link to={`/akun/${akunUnggulan.id}`} className="block w-full text-center mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors">
                Lihat Detail
              </Link>
            </div>
          ) : (
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 h-full flex items-center justify-center">
                <p className="text-gray-500">Tidak ada akun unggulan saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
