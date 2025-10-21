// frontend/src/pages/TopUpPaymentPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-hot-toast';

function TopUpPaymentPage() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // State untuk detail produk dan checkout
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameUserId, setGameUserId] = useState('');
  const [gameZoneId, setGameZoneId] = useState('');
  const [nickname, setNickname] = useState('');

  // State untuk kupon
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Menyimpan info kupon valid
  const [finalPrice, setFinalPrice] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // State untuk proses pembayaran
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // 1. Ambil detail produk & data dari URL
  useEffect(() => {
    // Ambil data game ID dari URL
    const uid = searchParams.get('uid');
    const zid = searchParams.get('zid');
    const nick = searchParams.get('nick');

    if (!uid || !nick) {
      toast.error("Informasi User ID tidak lengkap.");
      navigate('/top-up'); // Kembali jika data URL tidak lengkap
      return;
    }
    setGameUserId(uid);
    setGameZoneId(zid || ''); // zid bisa null
    setNickname(nick);

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // --- PERBAIKAN PATH API PRODUK ---
        const res = await apiClient.get(`/topup-products/${productId}/`);
        // --- SELESAI ---
        setProduct(res.data);
        setFinalPrice(parseFloat(res.data.harga)); // Set harga awal
      } catch (error) {
        console.error("Gagal memuat detail produk:", error);
        toast.error("Gagal memuat detail produk.");
        navigate('/top-up'); // Kembali jika produk tidak ditemukan
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();

    // Load Midtrans Snap script
    const script = document.createElement('script');
    script.src = settings.MIDTRANS_SNAP_URL; // Gunakan URL dari settings
    script.setAttribute('data-client-key', settings.MIDTRANS_CLIENT_KEY); // Gunakan client key
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup script saat unmount
    };
  }, [productId, searchParams, navigate]); // Tambah navigate sbg dependency

  // 2. Fungsi validasi kupon (PERBAIKAN PATH API KUPON)
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    setAppliedCoupon(null); // Reset kupon

    try {
        // --- PERBAIKAN PATH API KUPON ---
        const response = await apiClient.post('/validate-coupon-topup/', {
        // --- SELESAI ---
            kode_kupon: couponCode,
            product_id: productId,
        });
        if (response.data.valid) {
            setAppliedCoupon(response.data);
            setFinalPrice(parseFloat(response.data.harga_final));
            toast.success(`Kupon ${response.data.kode_kupon} diterapkan!`);
        } else {
             setCouponError(response.data.error || 'Kupon tidak valid.');
             setFinalPrice(parseFloat(product.harga)); // Kembalikan harga asli
        }
    } catch (error) {
        console.error("Gagal validasi kupon:", error.response?.data);
        setCouponError(error.response?.data?.error || 'Gagal menerapkan kupon.');
        setFinalPrice(parseFloat(product.harga)); // Kembalikan harga asli
        toast.error(error.response?.data?.error || 'Gagal menerapkan kupon.');
    } finally {
        setIsApplyingCoupon(false);
    }
  };

  // 3. Fungsi proses pembayaran (membuat transaksi & buka Snap)
  const handlePayment = async () => {
    if (!user) {
        toast.error("Anda harus login untuk membayar.");
        navigate('/login');
        return;
    }
    setIsProcessingPayment(true);
    try {
      // Panggil API create_topup_pembelian (path sudah benar sebelumnya)
      const res = await apiClient.post('/pembelian/create-topup/', {
        produk_id: productId,
        game_user_id: gameUserId,
        game_zone_id: gameZoneId || null, // Kirim null jika kosong
        kode_kupon: appliedCoupon ? appliedCoupon.kode_kupon : null, // Kirim kode kupon jika valid
      });

      const midtransToken = res.data.midtrans_token;

      if (midtransToken && window.snap) {
        window.snap.pay(midtransToken, {
          onSuccess: (result) => {
            toast.success("Pembayaran berhasil!");
            navigate('/profil'); // Arahkan ke riwayat
          },
          onPending: (result) => {
            toast("Menunggu pembayaran Anda!", { icon: '⏳' });
            navigate('/profil');
          },
          onError: (result) => {
            toast.error("Pembayaran gagal!");
          },
          onClose: () => {
            toast.info("Anda menutup popup pembayaran.");
            // Refresh halaman atau arahkan ke riwayat pending?
            // navigate('/profil'); // Arahkan ke riwayat untuk lihat status PENDING
          }
        });
      } else {
          throw new Error("Token Midtrans tidak diterima atau Snap tidak termuat.");
      }
    } catch (err) {
      toast.error('Gagal memulai pembayaran: ' + (err.response?.data?.error || 'Error server'));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) return <div className="text-center p-20 text-gray-400">Memuat checkout...</div>;
  if (!product) return <div className="text-center p-20 text-gray-400">Gagal memuat detail produk.</div>;

  const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Checkout Top Up</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Ringkasan Pesanan */}
        <div className="md:col-span-1">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-3">
            <h2 className="text-xl font-semibold text-white mb-4">Ringkasan Pesanan</h2>
            <div>
              <label className="text-sm text-gray-400">Produk:</label>
              <p className="text-md text-white">{product.nama_paket}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Game:</label>
              <p className="text-md text-white">{product.game}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">User ID:</label>
              <p className="text-md text-white">{gameUserId} {gameZoneId ? `(${gameZoneId})` : ''}</p>
            </div>
             <div>
              <label className="text-sm text-gray-400">Nickname:</label>
              <p className="text-md font-semibold text-white">{nickname}</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Metode Pembayaran & Kupon */}
        <div className="md:col-span-2">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Metode Pembayaran</h2>
            {/* Input Kupon */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Kode Kupon (Opsional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); setAppliedCoupon(null); setFinalPrice(parseFloat(product.harga)); }} // Reset saat diketik
                  placeholder="Masukkan kode kupon"
                  className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 uppercase focus:border-purple-500 focus:ring-purple-500"
                  disabled={isApplyingCoupon}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || isApplyingCoupon}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
                >
                  {isApplyingCoupon ? 'Memeriksa...' : 'Terapkan'}
                </button>
              </div>
              {couponError && <p className="text-red-400 text-sm mt-1">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-green-400 text-sm mt-1">
                  Kupon {appliedCoupon.kode_kupon} diterapkan! Diskon Rp {parseFloat(appliedCoupon.diskon_amount).toLocaleString('id-ID')}
                </p>
              )}
            </div>

            {/* Rincian Harga */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
               {appliedCoupon && (
                 <div className="flex justify-between text-gray-300">
                    <span>Harga Asli:</span>
                    <span>{formatHarga(product.harga)}</span>
                 </div>
               )}
               {appliedCoupon && (
                 <div className="flex justify-between text-gray-300">
                    <span>Diskon ({appliedCoupon.kode_kupon}):</span>
                    <span className="text-red-400">- {formatHarga(appliedCoupon.diskon_amount)}</span>
                 </div>
               )}
               <div className="flex justify-between text-xl font-bold text-purple-400 pt-2">
                 <span>Total Bayar:</span>
                 <span>{formatHarga(finalPrice)}</span>
               </div>
            </div>

            {/* Tombol Bayar */}
            <button
              onClick={handlePayment}
              disabled={loading || isProcessingPayment}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md text-lg disabled:opacity-50"
            >
              {isProcessingPayment ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tambahkan definisi settings jika belum ada
const settings = {
    MIDTRANS_SNAP_URL: import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js', // Default ke sandbox
    MIDTRANS_CLIENT_KEY: import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-...' // Ganti dengan Client Key Anda
};

export default TopUpPaymentPage;