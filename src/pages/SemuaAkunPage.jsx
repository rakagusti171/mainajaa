// frontend/src/pages/SemuaAkunPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';

function SemuaAkunPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk filter dan sort
  const [filterGame, setFilterGame] = useState('semua');
  const [sortBy, setSortBy] = useState('terbaru');
  
  const { user } = useContext(AuthContext); // Ambil user untuk cek favorit

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        // Kirim parameter filter ke backend
        const res = await apiClient.get('/accounts/', {
          params: { 
            game: filterGame,
            sort: sortBy
          }
        });
        setAccounts(res.data);
      } catch (err) {
        setError('Gagal memuat akun. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [filterGame, sortBy, user]); // Tambahkan user sebagai dependency

  // Mendapatkan daftar game unik untuk filter
  // (Ini bisa dibuat dinamis, tapi untuk sekarang kita hardcode)
  const games = ['semua', 'Mobile Legends', 'PUBG Mobile', 'Lainnya'];

  // Helper format harga
  const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

  if (loading) return <div className="text-center p-20 text-gray-400">Memuat akun...</div>;
  if (error) return <div className="text-center p-20 text-red-400">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Semua Akun</h1>

      {/* Kontrol Filter & Sort */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Filter Game */}
        <select 
          value={filterGame} 
          onChange={(e) => setFilterGame(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-md p-2"
        >
          {games.map(game => (
            <option key={game} value={game}>{game === 'semua' ? 'Semua Game' : game}</option>
          ))}
        </select>
        
        {/* Urutkan */}
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-md p-2"
        >
          <option value="terbaru">Urutkan: Terbaru</option>
          <option value="termurah">Urutkan: Termurah</option>
          <option value="termahal">Urutkan: Termahal</option>
        </select>
      </div>

      {/* Grid Akun */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {accounts.length > 0 ? (
          accounts.map(akun => (
            // --- KODE CARD DIMULAI DARI SINI ---
            <Link 
              key={akun.id} 
              to={`/akun/${akun.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col"
            >
              {/* 1. Ubah h-48 menjadi h-40 agar sama dengan TopUp */}
              <img 
                className="h-40 w-full object-cover" 
                src={akun.gambar} // Hapus http://... dari sini
                alt={akun.nama_akun} 
              />
              
              {/* 2. Ubah struktur div ini agar sama dengan TopUpCard */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-md font-semibold text-white">{akun.nama_akun}</h3>
                <p className="text-sm text-gray-400">{akun.game} - Level {akun.level}</p>
                
                {/* 3. Pindahkan flex-grow ke harga */}
                <p className="mt-3 text-lg font-bold text-purple-400 flex-grow">
                  {formatHarga(akun.harga)}
                </p>
                <span className="mt-3 block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-md text-sm">
                  Lihat Detail
                </span>
              </div>
            </Link>
            // --- KODE CARD BERAKHIR DI SINI ---
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">Tidak ada akun yang ditemukan.</p>
        )}
      </div>
    </div>
  );
}

export default SemuaAkunPage;