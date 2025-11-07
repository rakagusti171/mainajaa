import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import LazyImage from '../components/LazyImage';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function SemuaAkunPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterGame, setFilterGame] = useState('semua');
  const [sortBy, setSortBy] = useState('terbaru');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;
  
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/accounts/', {
          params: { 
            game: filterGame,
            sort: sortBy,
            page: currentPage,
            page_size: pageSize
          }
        });
        
        // Handle paginated response
        if (res.data.results) {
          setAccounts(res.data.results);
          setTotalPages(Math.ceil(res.data.count / pageSize));
          setTotalCount(res.data.count);
        } else {
          // Fallback for non-paginated response
          setAccounts(res.data);
          setTotalPages(1);
          setTotalCount(res.data.length);
        }
      } catch (err) {
        setError('Gagal memuat akun. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [currentPage, filterGame, sortBy, user]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterGame, sortBy]);

  const games = ['semua', 'Mobile Legends', 'PUBG Mobile', 'Lainnya'];

  const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

  if (error) return <div className="text-center p-12 sm:p-20 text-red-400 text-sm sm:text-base">{error}</div>;

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

      {/* --- Grid Produk --- */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {accounts.length > 0 ? (
              accounts.map(akun => (
                <Link 
                  key={akun.id} 
                  to={`/akun/${akun.id}`}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col"
                  aria-label={`View ${akun.nama_akun} details`}
                >
                  <LazyImage 
                    src={akun.gambar} 
                    alt={akun.nama_akun}
                    className="h-32 sm:h-40 w-full object-cover"
                  />
                  
                  <div className="p-2 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-xs sm:text-md font-semibold text-white line-clamp-2">{akun.nama_akun}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">{akun.game} - Level {akun.level}</p>
                    
                    <div className="flex-grow"></div>
                    
                    <p className="mt-2 sm:mt-3 text-sm sm:text-lg font-bold text-purple-400">
                      {formatHarga(akun.harga)}
                    </p>
                    <span className="mt-2 sm:mt-3 block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm">
                      Lihat Detail
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center text-sm sm:text-base">Tidak ada akun yang ditemukan.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                Menampilkan {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} dari {totalCount} akun
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-gray-800 border border-gray-700 rounded-md text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                          currentPage === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-gray-800 border border-gray-700 rounded-md text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SemuaAkunPage;
