import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import LazyImage from '../components/LazyImage';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

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

  if (error) return <div className="text-center p-12 sm:p-20 text-red-400 text-sm sm:text-base">{error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Top Up Game</h1>

      <div className="mb-6">
        <select 
          value={filterGame} 
          onChange={(e) => setFilterGame(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-md p-2 text-sm sm:text-base"
          aria-label="Filter by game"
        >
          {games.map(game => (
            <option key={game} value={game}>{game === 'semua' ? 'Semua Game' : game}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {products.length > 0 ? (
            products.map(product => (
              <Link 
                key={product.id} 
                to={`/top-up/${product.id}`}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col"
                aria-label={`View ${product.nama_paket} details`}
              >
                <LazyImage 
                  src={product.gambar} 
                  alt={product.nama_paket}
                  className="h-32 sm:h-40 w-full object-cover"
                />
                <div className="p-2 sm:p-4 flex flex-col flex-grow">
                  <h3 className="text-xs sm:text-md font-semibold text-white line-clamp-2">{product.nama_paket}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">{product.game}</p>
                  <p className="mt-2 sm:mt-3 text-sm sm:text-lg font-bold text-purple-400 flex-grow">
                    {formatHarga(product.harga)}
                  </p>
                  <span className="mt-2 sm:mt-3 block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm">
                    Top Up
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center text-sm sm:text-base">
              Tidak ada produk top up yang ditemukan untuk game ini.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TopUpPage;