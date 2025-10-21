import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

function AkunDetailPage() {
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarAccounts, setSimilarAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        setLoading(true);
        const accountRes = await apiClient.get(`/accounts/${accountId}/`);
        setAccount(accountRes.data);
        setIsFavorited(accountRes.data.is_favorited);

        if (accountRes.data.gambar) {
            setSelectedImage(accountRes.data.gambar);
        } 
        else if (accountRes.data.images && accountRes.data.images.length > 0) {
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

  const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

  if (loading) return <div className="text-center p-20 text-gray-400">Memuat akun...</div>;
  if (!account) return <div className="text-center p-20 text-gray-400">Akun tidak ditemukan.</div>;

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
        <Link to="/semua-akun" className="hover:text-white">Semua Akun</Link>
        <span className="mx-2">&gt;</span><span className="text-white">{account.nama_akun}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div>
            <img 
              src={selectedImage}
              alt={account.nama_akun} 
              className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-4 border border-gray-700"
            />
            {allImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto p-2">
                {allImages.map((img) => (
                  <button 
                    key={img.id}
                    onClick={() => setSelectedImage(img.gambar)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md border-2 transition-all ${
                        selectedImage === img.gambar ? 'border-purple-500' : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <img 
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
            <h2 className="text-2xl font-bold text-white mb-4">Deskripsi Akun</h2>
            <p className="text-gray-300 whitespace-pre-line">{account.deskripsi || 'Tidak ada deskripsi.'}</p>
          </div>
        </div>

        <div className="md:col-span-1">
          {/* PERBAIKAN: Hapus z-10, navbar dropdown akan tetap di atas */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-8">
            <h1 className="text-3xl font-bold text-white">{account.nama_akun}</h1>
            <p className="text-gray-400 mt-1">{account.game} • Level {account.level}</p>
            <p className="text-4xl font-bold text-purple-400 my-6">{formatHarga(account.harga)}</p>
            
            <button 
              onClick={handleBeliSekarang}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md text-lg"
            >
              Beli Sekarang
            </button>
            <button 
              onClick={handleToggleFavorite}
              className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center"
            >
              {isFavorited ? (
                <HeartIconSolid className="w-5 h-5 mr-2 text-red-500" />
              ) : (
                <HeartIconOutline className="w-5 h-5 mr-2" />
              )}
              {isFavorited ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
            </button>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">Perlindungan Pembeli</h3>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li><span className="text-green-500 mr-2">✓</span> Garansi 100% Uang Kembali</li>
                <li><span className="text-green-500 mr-2">✓</span> Transaksi Aman</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Ulasan Pelanggan untuk {account.game}</h2>
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
          <p className="text-gray-500">Belum ada ulasan untuk game ini.</p>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Akun Serupa</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {similarAccounts.length > 0 ? (
            similarAccounts.map(acc => (
              <Link key={acc.id} to={`/akun/${acc.id}`} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col">
                <img 
                  className="h-40 w-full object-cover" 
                  src={acc.gambar}
                  alt={acc.nama_akun} 
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-md font-semibold text-white">{acc.nama_akun}</h3>
                  <p className="text-sm text-gray-400">{acc.game}</p>
                  <p className="mt-3 text-lg font-bold text-purple-400 flex-grow">
                    {formatHarga(acc.harga)}
                  </p>
                  <span className="mt-3 block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-md text-sm">
                    Lihat Detail
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">Tidak ada akun serupa.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AkunDetailPage;