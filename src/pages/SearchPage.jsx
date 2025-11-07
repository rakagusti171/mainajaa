import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useLanguage } from '../context/LanguageContext';
import LazyImage from '../components/LazyImage';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [accounts, setAccounts] = useState([]);
  const [topupProducts, setTopupProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'accounts', 'topup'
  const { t } = useLanguage();

  useEffect(() => {
    if (!query.trim()) {
      setAccounts([]);
      setTopupProducts([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        // Search accounts
        const accountsRes = await apiClient.get('/accounts/', {
          params: { search: query }
        });
        const accountsData = Array.isArray(accountsRes.data.results) 
          ? accountsRes.data.results 
          : accountsRes.data;
        setAccounts(accountsData.filter(acc => 
          acc.nama_akun?.toLowerCase().includes(query.toLowerCase()) ||
          acc.game?.toLowerCase().includes(query.toLowerCase())
        ));

        // Search topup products
        const topupRes = await apiClient.get('/topup-products/');
        const topupData = Array.isArray(topupRes.data.results) 
          ? topupRes.data.results 
          : topupRes.data;
        setTopupProducts(topupData.filter(prod => 
          prod.nama_paket?.toLowerCase().includes(query.toLowerCase()) ||
          prod.game?.toLowerCase().includes(query.toLowerCase())
        ));
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

  const filteredAccounts = activeTab === 'all' || activeTab === 'accounts' ? accounts : [];
  const filteredTopup = activeTab === 'all' || activeTab === 'topup' ? topupProducts : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
        {t('searchResultsFor')} <span className="text-purple-400">"{query}"</span>
      </h1>

      {!query.trim() ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg mb-4">{t('enterKeyword')}</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex space-x-2 mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('all')} ({accounts.length + topupProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'accounts'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('account')} ({accounts.length})
            </button>
            <button
              onClick={() => setActiveTab('topup')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'topup'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('topUp')} ({topupProducts.length})
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <>
              {/* Accounts Results */}
              {(activeTab === 'all' || activeTab === 'accounts') && filteredAccounts.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('gamingAccounts')}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                    {filteredAccounts.map(akun => (
                      <Link
                        key={akun.id}
                        to={`/akun/${akun.id}`}
                        className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col"
                      >
                        <LazyImage
                          src={akun.gambar}
                          alt={akun.nama_akun}
                          className="h-32 sm:h-40 w-full object-cover"
                        />
                        <div className="p-2 sm:p-4 flex flex-col flex-grow">
                          <h3 className="text-xs sm:text-md font-semibold text-white line-clamp-2">{akun.nama_akun}</h3>
                          <p className="text-xs sm:text-sm text-gray-400 mt-1">{akun.game}</p>
                          <p className="mt-2 sm:mt-3 text-sm sm:text-lg font-bold text-purple-400 flex-grow">
                            {formatHarga(akun.harga)}
                          </p>
                          <span className="mt-2 sm:mt-3 block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm">
                            {t('viewDetails')}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* TopUp Results */}
              {(activeTab === 'all' || activeTab === 'topup') && filteredTopup.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('topUpProducts')}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                    {filteredTopup.map(product => (
                      <Link
                        key={product.id}
                        to={`/top-up/${product.id}`}
                        className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col"
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
                            {t('topUp')}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {!loading && filteredAccounts.length === 0 && filteredTopup.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg mb-4">{t('noResultsFor')} "{query}"</p>
                  <p className="text-sm mb-6">{t('tryOtherKeyword')}</p>
                  <Link
                    to="/semua-akun"
                    className="text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    {t('viewAllAccounts')} →
                  </Link>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SearchPage;

