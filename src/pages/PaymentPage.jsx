import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-hot-toast';

const settings = {
    MIDTRANS_SNAP_URL: import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js',
    MIDTRANS_CLIENT_KEY: import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'GANTI_DENGAN_CLIENT_KEY_ANDA'
};

function PaymentPage() {
  const { accountId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
  const [paymentMethod, setPaymentMethod] = useState('MIDTRANS');
  const [cryptoPaymentData, setCryptoPaymentData] = useState(null);
  const [showCryptoDetails, setShowCryptoDetails] = useState(false);

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
        toast.error(t('paymentFailed'));
    };
    document.body.appendChild(script);

    const fetchAccount = async () => {
      if (!user) {
        toast.error(t('mustLogin'));
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
        toast.error(t('accountSold'));
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
        toast.error(t('accountDataNotLoaded'));
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
        toast.success(t('couponApplied'));
      } else {
        setCouponError(response.data.error || t('couponInvalid'));
        toast.error(response.data.error || t('couponInvalid'));
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || t('couponInvalid');
      setCouponError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePayment = async () => {
     if (!account) {
        toast.error(t('accountDataNotLoaded'));
        return;
     }
     
     // Validate payment method requirements
     if (paymentMethod === 'MIDTRANS' && !window.snap) {
        toast.error(t('paymentNotReady'));
        return;
     }

    setIsProcessing(true);
    try {
      const res = await apiClient.post(`/pembelian/create-akun/`, {
        akun_id: accountId,
        kode_kupon: appliedCoupon,
        payment_method: paymentMethod,
      });

      // Handle Midtrans payment
      if (paymentMethod === 'MIDTRANS') {
        const midtransToken = res.data.midtrans_token;
        if (midtransToken) {
          window.snap.pay(midtransToken, {
            onSuccess: function(result){
              toast.success(t('paymentSuccess'));
              navigate('/profil');
            },
            onPending: function(result){
              toast(t('waitingPayment'), { icon: '⏳' });
              navigate('/profil');
            },
            onError: function(result){
              toast.error(t('paymentFailedMsg'));
              setIsProcessing(false);
            },
            onClose: function(){
              toast.info(t('paymentClosed'));
              setIsProcessing(false);
            }
          });
        } else {
          throw new Error(t('invalidToken'));
        }
      } else {
        // Handle Crypto payment
        setCryptoPaymentData({
          kode_transaksi: res.data.kode_transaksi,
          crypto_address: res.data.crypto_address,
          crypto_amount: res.data.crypto_amount,
          crypto_currency: res.data.crypto_currency,
          harga_total: res.data.harga_total,
        });
        setShowCryptoDetails(true);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(t('transactionFailed') + ' ' + (err.response?.data?.error || t('serverError')));
      setIsProcessing(false);
    }
  };

  const handleCopyAddress = () => {
    if (cryptoPaymentData?.crypto_address) {
      navigator.clipboard.writeText(cryptoPaymentData.crypto_address);
      toast.success('Wallet address berhasil disalin!');
    }
  };

  const handleSubmitTxHash = async () => {
    const txHash = document.getElementById('tx_hash').value;
    if (!txHash) {
      toast.error('Masukkan transaction hash');
      return;
    }

    try {
      const res = await apiClient.post('/pembelian/verify-crypto/', {
        kode_transaksi: cryptoPaymentData.kode_transaksi,
        tx_hash: txHash,
      });
      toast.success(res.data.message || 'Transaction hash berhasil disubmit. Admin akan memverifikasi pembayaran Anda.');
      navigate('/profil');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal submit transaction hash');
    }
  };

  if (loading) {
    return <div className="text-center p-20 text-gray-400">{t('loadingCheckout')}</div>;
  }

  if (!account) {
     return <div className="text-center p-20 text-red-400">{t('failedToLoadAccount')}</div>;
  }

  const formatHarga = (harga) => {
    const num = parseFloat(harga);
    return isNaN(num) ? '0' : num.toLocaleString('id-ID');
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">{t('checkout')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">{t('orderSummary')}</h2>
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
          <h2 className="text-2xl font-semibold text-white mb-4">{t('paymentMethod')}</h2>
          
          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Pilih Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('MIDTRANS')}
                className={`p-3 rounded-md border-2 transition-all ${
                  paymentMethod === 'MIDTRANS'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-white font-semibold">💳 Midtrans</div>
                <div className="text-xs text-gray-400 mt-1">Bank, E-Wallet, dll</div>
              </button>
              <button
                onClick={() => setPaymentMethod('CRYPTO_USDT')}
                className={`p-3 rounded-md border-2 transition-all ${
                  paymentMethod === 'CRYPTO_USDT'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-white font-semibold">₮ USDT</div>
                <div className="text-xs text-gray-400 mt-1">Crypto Payment</div>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                onClick={() => setPaymentMethod('CRYPTO_ETH')}
                className={`p-2 rounded-md border-2 transition-all text-xs ${
                  paymentMethod === 'CRYPTO_ETH'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-white font-semibold">Ξ ETH</div>
              </button>
              <button
                onClick={() => setPaymentMethod('CRYPTO_SOL')}
                className={`p-2 rounded-md border-2 transition-all text-xs ${
                  paymentMethod === 'CRYPTO_SOL'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-white font-semibold">◎ SOL</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">{t('couponCode')}</label>
            <div className="flex space-x-2 mt-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                placeholder={t('enterCouponCode')}
                className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 uppercase focus:border-purple-500 focus:ring-purple-500"
                disabled={isValidating}
              />
              <button
                onClick={handleValidateCoupon}
                disabled={isValidating || !couponCode}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
              >
                {isValidating ? '...' : t('apply')}
              </button>
            </div>
            {couponError && <p className="text-red-400 text-sm mt-2">{couponError}</p>}
          </div>

          <div className="space-y-2 border-t border-gray-700 mt-6 pt-4">
            {diskonAmount > 0 && (
                <div className="flex justify-between text-gray-300">
                    <span>{t('originalPrice')}</span>
                    <span>Rp {formatHarga(hargaAsli)}</span>
                </div>
            )}
            {diskonAmount > 0 && (
              <div className="flex justify-between text-gray-300">
                <span>{t('discount')} ({appliedCoupon}):</span>
                <span className="text-red-400">- Rp {formatHarga(diskonAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-white text-2xl font-bold pt-2">
              <span>{t('totalPay')}</span>
              <span className="text-purple-400">Rp {formatHarga(hargaFinal)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing || loading || showCryptoDetails}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md text-lg disabled:opacity-50"
          >
            {isProcessing ? t('processing') : showCryptoDetails ? 'Pesanan Dibuat' : t('payNow')}
          </button>
        </div>
      </div>

      {/* Crypto Payment Details Modal */}
      {showCryptoDetails && cryptoPaymentData && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Detail Pembayaran Crypto</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Kode Transaksi</label>
                <p className="text-white font-mono bg-gray-900 px-3 py-2 rounded">{cryptoPaymentData.kode_transaksi}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Jumlah yang Harus Dibayar</label>
                <p className="text-white text-xl font-bold">
                  {cryptoPaymentData.crypto_amount} {cryptoPaymentData.crypto_currency}
                </p>
                <p className="text-gray-400 text-sm">≈ Rp {cryptoPaymentData.harga_total?.toLocaleString('id-ID')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Wallet Address</label>
                <div className="flex items-center space-x-2">
                  <p className="text-white font-mono bg-gray-900 px-3 py-2 rounded flex-1 break-all text-sm">
                    {cryptoPaymentData.crypto_address}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded"
                  >
                    Salin
                  </button>
                </div>
              </div>
              
              <div className="bg-yellow-900/30 border border-yellow-700 rounded p-3">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Pastikan Anda mengirim <strong>tepat {cryptoPaymentData.crypto_amount} {cryptoPaymentData.crypto_currency}</strong> ke address di atas. 
                  Setelah pembayaran, submit transaction hash Anda di bawah.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Hash</label>
                <input
                  id="tx_hash"
                  type="text"
                  placeholder="Masukkan transaction hash setelah pembayaran"
                  className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:border-purple-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitTxHash}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Submit Transaction Hash
                </button>
                <button
                  onClick={() => {
                    setShowCryptoDetails(false);
                    navigate('/profil');
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Lihat di Profil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;