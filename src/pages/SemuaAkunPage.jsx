import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';

function SemuaAkunPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterGame, setFilterGame] = useState('semua');
  const [sortBy, setSortBy] = useState('terbaru');
  
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
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
  }, [filterGame, sortBy, user]);

  const games = ['semua', 'Mobile Legends', 'PUBG Mobile', 'Lainnya']; // Anda bisa tambahkan 'Black Desert Mobile' dll

  const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

  if (loading) return <div className="text-center p-20 text-gray-400">Memuat akun...</div>;
  if (error) return <div className="text-center p-20 text-red-400">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Semua Akun</h1>

      {/* --- Bagian Filter --- */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select 
          value={filterGame} 
          onChange={(e) => setFilterGame(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-md p-2"
        >
          {games.map(game => (
            <option key={game} value={game}>{game === 'semua' ? 'Semua Game' : game}</option>
          ))}
        </select>
        
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

      {/* --- Grid Produk (Dengan Perbaikan) --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {accounts.length > 0 ? (
          accounts.map(akun => (
            <Link 
              key={akun.id} 
              to={`/akun/${akun.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col"
            >
              <img 
                className="h-40 w-full object-cover" 
                src={akun.gambar} 
                alt={akun.nama_akun} 
              />
              
              {/* Pembungkus konten kartu, dibuat flex-grow agar kartu sama tinggi */}
              <div className="p-4 flex flex-col flex-grow">
                {/* === KONTEN ATAS === */}
                <h3 className="text-md font-semibold text-white">{akun.nama_akun}</h3>
                <p className="text-sm text-gray-400">{akun.game} - Level {akun.level}</p>
                
                {/* === SPACER (INI KUNCINYA) === */}
                {/* Spacer ini akan "tumbuh" dan mendorong konten bawah ke dasar kartu */}
                <div className="flex-grow"></div>
                
                {/* === KONTEN BAWAH === */}
                {/* Pastikan flex-grow DIHAPUS dari <p> harga */}
                <p className="mt-3 text-lg font-bold text-purple-400">
                  {formatHarga(akun.harga)}
                </p>
                <span className="mt-3 block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-md text-sm">
                  Lihat Detail
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">Tidak ada akun yang ditemukan.</p>
        )}
      </div>
    </div>
  );
}

export default SemuaAkunPage;
