import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { toast } from 'react-hot-toast'; // Impor toast untuk notifikasi

function TopUpDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [gameUserId, setGameUserId] = useState('');
  const [gameZoneId, setGameZoneId] = useState('');

  const [isCheckingId, setIsCheckingId] = useState(false);
  const [checkIdError, setCheckIdError] = useState('');
  const [nickname, setNickname] = useState('');

  // 1. Ambil detail produk (PERBAIKAN PATH API)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error
        // --- PERBAIKAN DI SINI ---
        const res = await apiClient.get(`/topup-products/${productId}/`);
        // --- SELESAI ---
        setProduct(res.data);
      } catch (err) {
        setError('Gagal memuat detail produk.');
        toast.error('Gagal memuat produk.'); // Notifikasi toast
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // 2. Fungsi Cek ID (PERBAIKAN PATH API)
  const handleCheckId = async () => {
    if (!gameUserId) {
      setCheckIdError('User ID wajib diisi.');
      return;
    }
    if (product?.game === 'Mobile Legends' && !gameZoneId) { // Tambah check product ada
      setCheckIdError('Zone ID wajib diisi untuk Mobile Legends.');
      return;
    }

    setIsCheckingId(true);
    setCheckIdError('');
    setNickname('');

    try {
      // --- PERBAIKAN DI SINI ---
      const res = await apiClient.post('/check-game-id/', { // Sesuaikan dengan urls.py
      // --- SELESAI ---
        game: product.game,
        user_id: gameUserId,
        zone_id: gameZoneId,
      });
      setNickname(res.data.nickname);
      toast.success(`Nickname ditemukan: ${res.data.nickname}`); // Notif sukses
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Pengecekan ID Gagal.';
      setCheckIdError(errorMsg);
      toast.error(`Cek ID Gagal: ${errorMsg}`); // Notif error
    } finally {
      setIsCheckingId(false);
    }
  };

  // 3. Fungsi untuk lanjut ke pembayaran
  const handleProceedToPayment = () => {
    // Pastikan nickname ada sebelum lanjut
    if (!nickname) {
        toast.error("Silakan cek ID Anda terlebih dahulu.");
        return;
    }
    // Kirim data ke halaman pembayaran
    navigate(`/top-up/bayar/${productId}?uid=${gameUserId}&zid=${gameZoneId}&nick=${nickname}`);
  };

  if (loading) return <div className="text-center p-20 text-gray-400">Memuat...</div>;
  if (error) return <div className="text-center p-20 text-red-400">{error}</div>;
  if (!product) return <div className="text-center p-20 text-gray-400">Produk tidak ditemukan.</div>; // Ubah teks

  const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-400 mb-6">
        <Link to="/top-up" className="hover:text-white">Top Up</Link>
        <span className="mx-2">&gt;</span><span className="text-white">{product.nama_paket}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Detail Produk */}
        <div className="md:col-span-1">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-8">
            {/* --- PERBAIKAN URL GAMBAR --- */}
            <img
              src={product.gambar} // Hapus base URL, serializer sudah mengurusnya
              alt={product.nama_paket}
              className="w-full h-auto rounded-md mb-4 border border-gray-700" // Tambah border
            />
            {/* --- SELESAI --- */}
            <h1 className="text-2xl font-bold text-white">{product.nama_paket}</h1>
            <p className="text-gray-400 mt-1">{product.game}</p>
            <p className="text-3xl font-bold text-purple-400 my-4">{formatHarga(product.harga)}</p>
          </div>
        </div>

        {/* Kolom Kanan: Form ID & Cek */}
        <div className="md:col-span-2">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-white mb-4">1. Masukkan User ID</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={gameUserId}
                onChange={(e) => {setGameUserId(e.target.value); setNickname(''); setCheckIdError('');}} // Reset nickname saat ID berubah
                placeholder="User ID"
                className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:border-purple-500 focus:ring-purple-500" // Tambah focus style
              />
              {product.game === 'Mobile Legends' && (
                <input
                  type="text"
                  value={gameZoneId}
                  onChange={(e) => {setGameZoneId(e.target.value); setNickname(''); setCheckIdError('');}} // Reset nickname saat ID berubah
                  placeholder="Zone ID (e.g. 1234)"
                  className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:border-purple-500 focus:ring-purple-500" // Tambah focus style
                />
              )}
            </div>

            <button
              onClick={handleCheckId}
              disabled={isCheckingId || !gameUserId || (product.game === 'Mobile Legends' && !gameZoneId)} // Disable jika input kosong
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" // Tambah disabled cursor
            >
              {isCheckingId ? 'Mengecek...' : 'Cek ID'}
            </button>

            {/* Hasil Cek ID */}
            {checkIdError && <p className="text-red-400 text-sm mt-3">{checkIdError}</p>}
            {nickname && (
              <div className="mt-4 p-3 bg-green-900/50 border border-green-700 rounded-md">
                <span className="text-gray-300">Nickname: </span>
                <span className="font-bold text-white">{nickname}</span>
              </div>
            )}

            <p className="text-gray-500 text-sm mt-4">
              Untuk tes (Mobile Legends): User ID `12345`, Zone ID `1234`. <br/>
              Untuk tes (PUBG Mobile): User ID `55555`.
            </p>

            {/* Tombol Lanjut */}
            <div className="border-t border-gray-700 mt-8 pt-6">
              <button
                onClick={handleProceedToPayment}
                disabled={!nickname || isCheckingId}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopUpDetailPage;