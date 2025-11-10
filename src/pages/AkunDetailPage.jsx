import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import LazyImage from '../components/LazyImage';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import { toast } from 'react-hot-toast';

function AkunDetailPage() {
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarAccounts, setSimilarAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        setLoading(true);
        const accountRes = await apiClient.get(`/accounts/${accountId}/`);
        setAccount(accountRes.data);
        setIsFavorited(accountRes.data.is_favorited);

        if (accountRes.data.gambar) {
            setSelectedImage(accountRes.data.gambar);
        } else if (accountRes.data.images && accountRes.data.images.length > 0) {
            setSelectedImage(accountRes.data.images[0].gambar);
        }

        const reviewsRes = await apiClient.get(`/reviews/${accountRes.data.game}/`);
        setReviews(reviewsRes.data);
        const similarRes = await apiClient.get(`/accounts/${accountId}/similar/`);
        setSimilarAccounts(similarRes.data);
        
      } catch (error) {
        console.error("Gagal memuat detail akun:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccountDetails();
  }, [accountId, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await apiClient.post(`/accounts/${accountId}/toggle-favorite/`);
      setIsFavorited(res.data.favorited);
    } catch (error) {
      console.error('Gagal toggle favorit:', error);
    }
  };

  const handleBeliSekarang = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/bayar/${accountId}`);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (account.is_sold || account.stock <= 0) {
      toast.error(account.stock <= 0 ? 'Stok akun ini sudah habis' : 'Akun ini sudah terjual');
      return;
    }
    const success = await addToCart('AKUN', { akun_id: accountId, quantity: 1 });
    if (success) {
      // Optional: navigate to cart or show message
    }
  };

  const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

  const openModal = () => {
    if (selectedImage) {
        setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div className="text-center p-20 text-gray-400">{t('loadingAccount')}</div>;
  if (!account) return <div className="text-center p-20 text-gray-400">{t('accountNotFound')}</div>;

  const allImages = [];
  if (account.gambar) {
    allImages.push({ id: 'main', gambar: account.gambar });
  }
  if (account.images) {
    allImages.push(...account.images);
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-sm text-gray-400 mb-6">
        <Link to="/semua-akun" className="hover:text-white">{t('allAccounts')}</Link>
        <span className="mx-2">&gt;</span><span className="text-white">{account.nama_akun}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div>
            <LazyImage 
              src={selectedImage}
              alt={account.nama_akun} 
              className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-cover rounded-lg mb-4 border border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={openModal} 
            />
            {allImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto p-2">
                {allImages.map((img) => (
                  <button 
                    key={img.id}
                    onClick={() => setSelectedImage(img.gambar)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md border-2 transition-all ${
                        selectedImage === img.gambar ? 'border-purple-500' : 'border-gray-600 hover:border-gray-400'
                    }`}
                    aria-label={`Select image ${img.id}`}
                  >
                    <LazyImage 
                      src={img.gambar} 
                      alt="thumbnail" 
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">{t('accountDescription')}</h2>
            <p className="text-gray-300 whitespace-pre-line">{account.deskripsi || t('noDescription')}</p>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-8">
            <h1 className="text-3xl font-bold text-white">{account.nama_akun}</h1>
            <p className="text-gray-400 mt-1">{account.game} • {t('level')} {account.level}</p>
            <p className="text-4xl font-bold text-purple-400 my-6">{formatHarga(account.harga)}</p>
            {account.stock !== undefined && (
              <p className={`text-sm mb-4 ${account.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {account.stock > 0 ? `Stok: ${account.stock} tersedia` : 'Stok habis'}
              </p>
            )}
            {!account.is_sold && account.is_available !== false && (
              <>
                <button 
                  onClick={handleBeliSekarang}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md text-lg"
                >
                  {t('buyNow')}
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center"
                >
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Tambah ke Cart
                </button>
              </>
            )}
            {account.is_sold && (
              <div className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md text-center">
                Terjual
              </div>
            )}
            <button 
              onClick={handleToggleFavorite}
              className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center"
            >
              {isFavorited ? <HeartIconSolid className="w-5 h-5 mr-2 text-red-500" /> : <HeartIconOutline className="w-5 h-5 mr-2" />}
              {isFavorited ? t('removeFromFavorites') : t('addToFavorites')}
            </button>
            
            {/* Social Sharing */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Bagikan Produk</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const text = encodeURIComponent(`${account.nama_akun} - ${account.game} - ${formatHarga(account.harga)}`);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
                  }}
                  className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const text = encodeURIComponent(`${account.nama_akun} - ${account.game} - ${formatHarga(account.harga)}`);
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
                  }}
                  className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const text = encodeURIComponent(`Lihat akun gaming ini: ${account.nama_akun} - ${account.game} - ${formatHarga(account.harga)}`);
                    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
                  }}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url).then(() => {
                      toast.success('Link berhasil disalin!');
                    }).catch(() => {
                      toast.error('Gagal menyalin link');
                    });
                  }}
                  className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Salin Link
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">{t('buyerProtection')}</h3>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li><span className="text-green-500 mr-2">✓</span> {t('moneyBackGuarantee')}</li>
                <li><span className="text-green-500 mr-2">✓</span> {t('secureTransaction')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">{t('customerReviews')} {account.game}</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-white">{review.pembeli_username}</span>
                  <span className="text-yellow-400 ml-3">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-300">{review.ulasan}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{t('noReviews')}</p>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">{t('similarAccounts')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {similarAccounts.length > 0 ? (
            similarAccounts.map(acc => (
              <Link key={acc.id} to={`/akun/${acc.id}`} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col">
                <img className="h-40 w-full object-cover" src={acc.gambar} alt={acc.nama_akun} />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-md font-semibold text-white">{acc.nama_akun}</h3>
                  <p className="text-sm text-gray-400">{acc.game}</p>
                  <p className="mt-3 text-lg font-bold text-purple-400 flex-grow">{formatHarga(acc.harga)}</p>
                  <span className="mt-3 block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-md text-sm">{t('viewDetails')}</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">{t('noSimilarAccounts')}</p>
          )}
        </div>
      </div>
      
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Tampilan penuh" 
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <button 
              onClick={closeModal}
              className="absolute -top-4 -right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
              aria-label={t('close')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AkunDetailPage;
