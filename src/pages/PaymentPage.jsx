import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const settings = {
    MIDTRANS_SNAP_URL: import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js',
    MIDTRANS_CLIENT_KEY: import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'GANTI_DENGAN_CLIENT_KEY_ANDA'
};

function PaymentPage() {
  const { accountId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [hargaAsli, setHargaAsli] = useState(0);
  const [diskonAmount, setDiskonAmount] = useState(0);
  const [hargaFinal, setHargaFinal] = useState(0);

  useEffect(() => {
    let scriptAdded = false;
    const script = document.createElement('script');
    script.src = settings.MIDTRANS_SNAP_URL;
    script.setAttribute('data-client-key', settings.MIDTRANS_CLIENT_KEY);
    script.async = true;
    script.onload = () => {
      scriptAdded = true;
      console.log("Midtrans Snap script loaded.");
    };
    script.onerror = () => {
        console.error("Failed to load Midtrans Snap script.");
        toast.error("Gagal memuat script pembayaran. Coba refresh halaman.");
    };
    document.body.appendChild(script);

    const fetchAccount = async () => {
      if (!user) {
        toast.error("Anda harus login untuk melanjutkan.");
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const res = await apiClient.get(`/accounts/${accountId}/`);
        setAccount(res.data);
        const originalPrice = parseFloat(res.data.harga);
        if (isNaN(originalPrice)) {
             throw new Error("Harga akun tidak valid.");
        }
        setHargaAsli(originalPrice);
        setHargaFinal(originalPrice);
      } catch (err) {
        console.error("Fetch account error:", err);
        toast.error('Gagal memuat detail akun. Mungkin akun sudah terjual.');
        navigate('/semua-akun');
      } finally {
         setLoading(false);
      }
    };

    fetchAccount();

    return () => {
      if (scriptAdded) {
          const existingScript = document.querySelector(`script[src="${settings.MIDTRANS_SNAP_URL}"]`);
          if (existingScript && document.body.contains(existingScript)) {
            try {
                document.body.removeChild(existingScript);
                console.log("Midtrans Snap script removed.");
            } catch (e) {
                console.error("Error removing Midtrans script:", e);
            }
          }
      }
    };
  }, [accountId, user, navigate]);

  const handleValidateCoupon = async () => {
    setIsValidating(true);
    setCouponError('');
    setAppliedCoupon(null);

     if (account) {
        const originalPrice = parseFloat(account.harga);
        setHargaAsli(originalPrice);
        setDiskonAmount(0);
        setHargaFinal(originalPrice);
     } else {
        toast.error("Data akun belum termuat.");
        setIsValidating(false);
        return;
     }

    try {
      const response = await apiClient.post('/validate-coupon-akun/', {
        kode_kupon: couponCode,
        account_id: accountId,
      });

      if (response.data.valid) {
        setAppliedCoupon(response.data.kode_kupon);
        setHargaAsli(parseFloat(response.data.harga_asli));
        setDiskonAmount(parseFloat(response.data.diskon_amount));
        setHargaFinal(parseFloat(response.data.harga_final));
        toast.success(`Kupon '${response.data.kode_kupon}' berhasil diterapkan!`);
      } else {
        setCouponError(response.data.error || 'Kupon tidak valid.');
        toast.error(response.data.error || 'Kupon tidak valid.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Kupon tidak valid.';
      setCouponError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePayment = async () => {
     if (!account) {
        toast.error("Data akun belum termuat.");
        return;
     }
     if (!window.snap) {
        toast.error("Layanan pembayaran belum siap. Coba refresh halaman.");
        return;
     }

    setIsProcessing(true);
    try {
      const res = await apiClient.post(`/pembelian/create-akun/`, {
        akun_id: accountId,
        kode_kupon: appliedCoupon,
      });

      const midtransToken = res.data.midtrans_token;

      if (midtransToken) {
        window.snap.pay(midtransToken, {
          onSuccess: function(result){
            toast.success("Pembayaran berhasil!");
            navigate('/profil');
          },
          onPending: function(result){
            toast("Menunggu pembayaran Anda!", { icon: '⏳' });
            navigate('/profil');
          },
          onError: function(result){
            toast.error("Pembayaran gagal!");
            setIsProcessing(false);
          },
          onClose: function(){
            toast.info('Anda menutup popup pembayaran.');
            setIsProcessing(false);
          }
        });
      } else {
         throw new Error("Token Midtrans tidak diterima.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error('Gagal membuat transaksi: ' + (err.response?.data?.error || 'Terjadi kesalahan server.'));
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center p-20 text-gray-400">Memuat checkout...</div>;
  }

  if (!account) {
     return <div className="text-center p-20 text-red-400">Gagal memuat detail akun. Silakan coba lagi.</div>;
  }

  const formatHarga = (harga) => {
    const num = parseFloat(harga);
    return isNaN(num) ? '0' : num.toLocaleString('id-ID');
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">Checkout Pembayaran</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Ringkasan Pesanan</h2>
          <div className="flex space-x-4">
            <img
              src={account.gambar}
              alt={account.nama_akun}
              className="w-24 h-24 object-cover rounded-md border border-gray-600"
            />
            <div>
              <h3 className="text-lg font-bold text-white">{account.nama_akun}</h3>
              <p className="text-gray-400">{account.game} - Level {account.level}</p>
              <p className="text-xl font-bold text-purple-400 mt-2">
                Rp {formatHarga(account.harga)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Metode Pembayaran</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300">Kode Kupon (Opsional)</label>
            <div className="flex space-x-2 mt-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                placeholder="Masukkan kode kupon"
                className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 uppercase focus:border-purple-500 focus:ring-purple-500"
                disabled={isValidating}
              />
              <button
                onClick={handleValidateCoupon}
                disabled={isValidating || !couponCode}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
              >
                {isValidating ? '...' : 'Terapkan'}
              </button>
            </div>
            {couponError && <p className="text-red-400 text-sm mt-2">{couponError}</p>}
          </div>

          <div className="space-y-2 border-t border-gray-700 mt-6 pt-4">
            {diskonAmount > 0 && (
                <div className="flex justify-between text-gray-300">
                    <span>Harga Asli:</span>
                    <span>Rp {formatHarga(hargaAsli)}</span>
                </div>
            )}
            {diskonAmount > 0 && (
              <div className="flex justify-between text-gray-300">
                <span>Diskon ({appliedCoupon}):</span>
                <span className="text-red-400">- Rp {formatHarga(diskonAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-white text-2xl font-bold pt-2">
              <span>Total Bayar:</span>
              <span className="text-purple-400">Rp {formatHarga(hargaFinal)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing || loading}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md text-lg disabled:opacity-50"
          >
            {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;