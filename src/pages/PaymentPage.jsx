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
     if (!window.snap) {
        toast.error(t('paymentNotReady'));
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
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(t('transactionFailed') + ' ' + (err.response?.data?.error || t('serverError')));
      setIsProcessing(false);
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
            disabled={isProcessing || loading}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md text-lg disabled:opacity-50"
          >
            {isProcessing ? t('processing') : t('payNow')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;