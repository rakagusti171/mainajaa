import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-hot-toast';
import LazyImage from '../components/LazyImage';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const settings = {
    MIDTRANS_SNAP_URL: import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js',
    MIDTRANS_CLIENT_KEY: import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'GANTI_DENGAN_CLIENT_KEY_ANDA'
};

function CartPage() {
  const { cart, loading, updateCartItem, removeFromCart, clearCart, checkoutFromCart, fetchCart } = useContext(CartContext);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('MIDTRANS');
  const [cryptoPaymentData, setCryptoPaymentData] = useState(null);
  const [showCryptoDetails, setShowCryptoDetails] = useState(false);

  useEffect(() => {
    // Load Midtrans script
    let scriptAdded = false;
    const script = document.createElement('script');
    script.src = settings.MIDTRANS_SNAP_URL;
    script.setAttribute('data-client-key', settings.MIDTRANS_CLIENT_KEY);
    script.async = true;
    script.onload = () => { scriptAdded = true; };
    document.body.appendChild(script);
    
    return () => {
      if (scriptAdded) {
        const existingScript = document.querySelector(`script[src="${settings.MIDTRANS_SNAP_URL}"]`);
        if (existingScript && document.body.contains(existingScript)) {
          document.body.removeChild(existingScript);
        }
      }
    };
  }, []);

  const formatHarga = (harga) => {
    const num = parseFloat(harga);
    return isNaN(num) ? '0' : num.toLocaleString('id-ID');
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('Cart kosong');
      return;
    }

    if (paymentMethod === 'MIDTRANS' && !window.snap) {
      toast.error('Payment system belum siap');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await checkoutFromCart(couponCode || null, paymentMethod);
      
      if (result) {
        if (paymentMethod === 'MIDTRANS' && result.midtrans_token) {
          window.snap.pay(result.midtrans_token, {
            onSuccess: (paymentResult) => {
              toast.success('Pembayaran berhasil!');
              navigate('/profil');
            },
            onPending: (paymentResult) => {
              toast('Menunggu pembayaran Anda...', { icon: '⏳' });
              navigate('/profil');
            },
            onError: (paymentResult) => {
              toast.error('Pembayaran gagal!');
              fetchCart(); // Refresh cart jika payment failed
            },
            onClose: () => {
              toast.info('Anda menutup popup pembayaran.');
              fetchCart(); // Refresh cart jika user close payment
            }
          });
        } else if (result.crypto_address) {
          // Handle Crypto payment
          setCryptoPaymentData({
            kode_transaksi: result.kode_transaksi,
            crypto_address: result.crypto_address,
            crypto_amount: result.crypto_amount,
            crypto_currency: result.crypto_currency,
            total_price: result.total_price,
          });
          setShowCryptoDetails(true);
          setIsProcessing(false);
        } else {
          toast.error('Gagal memproses checkout');
        }
      } else {
        toast.error('Gagal memproses checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Gagal checkout');
    } finally {
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
    const txHash = document.getElementById('cart_tx_hash').value;
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
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-gray-400">Memuat cart...</div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Cart</h1>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">Cart Anda kosong</p>
          <button
            onClick={() => navigate('/semua-akun')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-md"
          >
            Lihat Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-8">Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image - Cart hanya support AKUN */}
                <div className="flex-shrink-0">
                  {item.akun_detail && (
                    <LazyImage
                      src={item.akun_detail.gambar}
                      alt={item.akun_detail.nama_akun}
                      className="w-24 h-24 object-cover rounded-md border border-gray-600"
                    />
                  )}
                </div>

                {/* Details - Cart hanya support AKUN */}
                <div className="flex-grow">
                  {item.akun_detail && (
                    <>
                      <h3 className="text-lg font-semibold text-white">{item.akun_detail.nama_akun}</h3>
                      <p className="text-gray-400 text-sm">{item.akun_detail.game} - Level {item.akun_detail.level}</p>
                      <p className="text-purple-400 font-bold text-lg mt-2">
                        Rp {formatHarga(item.harga_saat_ditambahkan)} x {item.quantity} = Rp {formatHarga(item.total_price)}
                      </p>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-300 p-2"
                    title="Hapus item"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-4">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart Button */}
          <div className="flex justify-end">
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Hapus Semua Item
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-4">
            <h2 className="text-2xl font-semibold text-white mb-4">Ringkasan Pesanan</h2>
            
            {/* Payment Method Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => setPaymentMethod('MIDTRANS')}
                  className={`p-2 rounded-md border-2 text-xs transition-all ${
                    paymentMethod === 'MIDTRANS'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-white font-semibold">💳 Midtrans</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('CRYPTO_USDT')}
                  className={`p-2 rounded-md border-2 text-xs transition-all ${
                    paymentMethod === 'CRYPTO_USDT'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-white font-semibold">₮ USDT</div>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('CRYPTO_ETH')}
                  className={`p-2 rounded-md border-2 text-xs transition-all ${
                    paymentMethod === 'CRYPTO_ETH'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-white font-semibold">Ξ ETH</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('CRYPTO_SOL')}
                  className={`p-2 rounded-md border-2 text-xs transition-all ${
                    paymentMethod === 'CRYPTO_SOL'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-white font-semibold">◎ SOL</div>
                </button>
              </div>
            </div>
            
            {/* Coupon Code */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Kode Kupon</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Masukkan kode"
                  className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 uppercase focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>Rp {formatHarga(cart.total_price)}</span>
              </div>
              <div className="flex justify-between text-white text-xl font-bold pt-2">
                <span>Total</span>
                <span className="text-purple-400">Rp {formatHarga(cart.total_price)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing || cart.items.length === 0 || showCryptoDetails}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Memproses...' : showCryptoDetails ? 'Pesanan Dibuat' : 'Checkout'}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              * Semua item akan diproses dalam satu transaksi
            </p>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Catatan: Cart hanya untuk akun gaming. Untuk top-up, silakan lakukan pembelian langsung.
            </p>
          </div>
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
                <p className="text-gray-400 text-sm">≈ Rp {cryptoPaymentData.total_price?.toLocaleString('id-ID')}</p>
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
                  id="cart_tx_hash"
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

export default CartPage;

