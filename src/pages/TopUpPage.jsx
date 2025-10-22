import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

function TopUpPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterGame, setFilterGame] = useState('semua');
  
  const games = ['semua', 'Mobile Legends', 'PUBG Mobile', 'Lainnya'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/topup-products/', {
          params: { 
            game: filterGame 
          }
        });
        setProducts(res.data);
      } catch (err) {
        setError('Gagal memuat produk. Coba lagi nanti.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filterGame]); 

  const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

  if (loading) return <div className="text-center p-20 text-gray-400">Memuat...</div>;
  if (error) return <div className="text-center p-20 text-red-400">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Top Up Game</h1>

      <div className="mb-6">
        <select 
          value={filterGame} 
          onChange={(e) => setFilterGame(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-md p-2"
        >
          {games.map(game => (
            <option key={game} value={game}>{game === 'semua' ? 'Semua Game' : game}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <Link 
              key={product.id} 
              to={`/top-up/${product.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col"
            >
              <img 
                className="h-40 w-full object-cover" 
                src={product.gambar} 
                alt={product.nama_paket} 
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-md font-semibold text-white">{product.nama_paket}</h3>
                <p className="text-sm text-gray-400">{product.game}</p>
                <p className="mt-3 text-lg font-bold text-purple-400 flex-grow">
                  {formatHarga(product.harga)}
                </p>
                <span className="mt-3 block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-md text-sm">
                  Top Up
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            Tidak ada produk top up yang ditemukan untuk game ini.
          </p>
        )}
      </div>
    </div>
  );
}

export default TopUpPage;