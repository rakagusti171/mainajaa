
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"; 
import { toast } from 'react-hot-toast'; 

function FavoritPage() {
  const [favoriteAccounts, setFavoriteAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/accounts/favorit/');
      setFavoriteAccounts(res.data);
    } catch (err) {
      setError('Gagal memuat akun favorit.');
      toast.error('Gagal memuat favorit.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, navigate]); 

  const handleRemoveFavorite = async (accountId) => {
    try {
      const originalFavorites = [...favoriteAccounts];
      setFavoriteAccounts(currentFavorites =>
        currentFavorites.filter(acc => acc.id !== accountId)
      );

      await apiClient.post(`/accounts/${accountId}/toggle-favorite/`);
      toast.success('Dihapus dari favorit.');

    } catch (error) {
      console.error('Gagal menghapus favorit:', error);
      toast.error('Gagal menghapus favorit.');
    }
  };

  const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

  if (loading) return <div className="text-center p-20 text-gray-400">Memuat favorit...</div>;
  if (error) return <div className="text-center p-20 text-red-400">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Akun Favorit Saya</h1>

      {favoriteAccounts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favoriteAccounts.map(akun => (
            <div
              key={akun.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col relative group" // Tambah relative group
            >
              <button
                onClick={() => handleRemoveFavorite(akun.id)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-black/40 rounded-full text-red-500 hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100" // Muncul saat hover
                title="Hapus dari Favorit"
              >
                <HeartIconSolid className="w-5 h-5" />
              </button>

              <Link to={`/akun/${akun.id}`} className="flex flex-col flex-grow"> 
                <img
                  className="h-40 w-full object-cover"
                  src={akun.gambar}
                  alt={akun.nama_akun}
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-md font-semibold text-white">{akun.nama_akun}</h3>
                  <p className="text-sm text-gray-400">{akun.game} - Level {akun.level}</p>
                  <p className="mt-3 text-lg font-bold text-purple-400 flex-grow">
                    {formatHarga(akun.harga)}
                  </p>
                  <span className="mt-3 block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-md text-sm">
                    Lihat Detail
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-20 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-gray-400 text-lg mb-4">Anda belum memiliki akun favorit.</p>
          <Link
            to="/semua-akun"
            className="text-purple-400 hover:text-purple-300 font-semibold"
          >
            Jelajahi semua akun &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

export default FavoritPage;