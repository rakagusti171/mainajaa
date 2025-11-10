// frontend/src/pages/PurchaseDetailPage.jsx
import React, { useState, useEffect, useContext }
from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-hot-toast';

function PurchaseDetailPage() {
    const { kodeTransaksi } = useParams();
    const { user } = useContext(AuthContext);

    const [pesanan, setPesanan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [rating, setRating] = useState(0);
    const [ulasanText, setUlasanText] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        if (!kodeTransaksi || !user) return;

        const fetchPesanan = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await apiClient.get(`/pembelian/detail/${kodeTransaksi}/`);
                setPesanan(res.data);
                
                if (res.data.tipe === 'Akun' && res.data.rating) {
                    setRating(res.data.rating);
                    setUlasanText(res.data.ulasan || '');
                }
                
            } catch (err) {
                console.error("Gagal memuat detail pesanan:", err);
                setError('Gagal memuat detail pesanan. Mungkin tidak ditemukan atau bukan milik Anda.');
                toast.error('Gagal memuat detail pesanan.');
            } finally {
                setLoading(false);
            }
        };
        fetchPesanan();
    }, [kodeTransaksi, user]); 

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Harap berikan rating bintang.');
            return;
        }
        
        setIsSubmittingReview(true);
        try {
            const res = await apiClient.post(`/pembelian/review/${pesanan.id}/`, {
                rating: rating,
                ulasan: ulasanText
            });
            toast.success('Ulasan berhasil dikirim!');
            
            setPesanan(prev => ({ 
                ...prev, 
                rating: res.data.rating, 
                ulasan: res.data.ulasan 
            }));
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Gagal mengirim ulasan.';
            toast.error(errorMsg);
            console.error(err);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;
    const formatTanggal = (tanggal) => new Date(tanggal).toLocaleString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    
    if (loading) return <div className="text-center p-20 text-gray-400">Memuat detail pesanan...</div>;
    if (error) return <div className="text-center p-20 text-red-400">{error}</div>;
    if (!pesanan) return <div className="text-center p-20 text-gray-400">Pesanan tidak ditemukan.</div>;

    // Check if this is a cart order
    const isCartOrder = pesanan.tipe === 'CART' || pesanan.is_cart_order;

    return (
        <div className="container mx-auto px-6 py-8 max-w-4xl">
            <div className="mb-4 text-sm text-gray-400">
                <Link to="/profil" className="hover:text-white">Profil</Link>
                <span className="mx-2">&gt;</span>
                <span className="text-white">Detail Pesanan</span>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-white">Detail Pesanan</h1>
                    {isCartOrder && (
                        <span className="px-3 py-1 text-xs font-semibold bg-purple-600/50 text-purple-300 rounded-full border border-purple-500">
                            CART ORDER
                        </span>
                    )}
                </div>
                <p className="text-lg text-purple-400 font-mono mb-6">{pesanan.kode_transaksi}</p>

                {pesanan.message && (
                    <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded text-blue-300 text-sm">
                        {pesanan.message}
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`font-semibold ${pesanan.status === 'COMPLETED' ? 'text-green-400' : pesanan.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400'}`}>
                            {pesanan.status}
                        </span>
                    </div>
                    {!isCartOrder && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Item:</span>
                                <span className="font-semibold text-white">{pesanan.nama_item || pesanan.nama_akun}</span>
                            </div>
                        </>
                    )}
                    {isCartOrder && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Jumlah Item:</span>
                            <span className="font-semibold text-white">{pesanan.total_items || pesanan.order_items?.length || 0} akun</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-400">Tanggal:</span>
                        <span className="font-semibold text-white">{formatTanggal(pesanan.tanggal || pesanan.dibuat_pada)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Total Bayar:</span>
                        <span className="font-semibold text-white">{formatHarga(pesanan.total || pesanan.harga_total)}</span>
                    </div>
                    {pesanan.kupon && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Kupon:</span>
                            <span className="font-semibold text-green-400">{pesanan.kupon}</span>
                        </div>
                    )}
                    {pesanan.payment_method && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Metode Pembayaran:</span>
                            <span className="font-semibold text-white">
                                {pesanan.payment_method === 'MIDTRANS' ? '💳 Midtrans' : 
                                 pesanan.payment_method === 'CRYPTO_USDT' ? '₮ USDT' :
                                 pesanan.payment_method === 'CRYPTO_ETH' ? 'Ξ Ethereum' :
                                 pesanan.payment_method === 'CRYPTO_SOL' ? '◎ Solana' :
                                 pesanan.payment_method}
                            </span>
                        </div>
                    )}
                    {pesanan.tipe === 'TopUp' && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Game ID:</span>
                            <span className="font-semibold text-white">
                                {pesanan.game_user_id} {pesanan.game_zone_id ? `(${pesanan.game_zone_id})` : ''}
                            </span>
                        </div>
                    )}
                </div>

                {/* Cart Order - Multiple Accounts */}
                {isCartOrder && pesanan.order_items && pesanan.order_items.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Akun yang Dibeli ({pesanan.order_items.length})
                        </h2>
                        <div className="space-y-4">
                            {pesanan.order_items.map((item, index) => (
                                <div key={item.id || index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-1 text-xs font-semibold bg-purple-600/50 text-purple-300 rounded">
                                            Akun {index + 1}
                                        </span>
                                        <h3 className="text-lg font-semibold text-white">
                                            {item.akun?.nama_akun || 'N/A'}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                        <div>
                                            <span className="text-gray-400">Game:</span>
                                            <span className="ml-2 text-white">{item.akun?.game || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Level:</span>
                                            <span className="ml-2 text-white">{item.akun?.level || 'N/A'}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-400">Harga:</span>
                                            <span className="ml-2 text-purple-400 font-semibold">
                                                {formatHarga(item.total_price || item.harga_saat_ditambahkan)}
                                            </span>
                                        </div>
                                    </div>
                                    {pesanan.status === 'COMPLETED' && item.akun_email && item.akun_password && (
                                        <div className="mt-3 pt-3 border-t border-gray-700">
                                            <h4 className="text-sm font-semibold text-green-400 mb-2">Data Akun:</h4>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="text-gray-400">Email/Username:</span>
                                                    <span className="ml-2 font-mono text-white bg-gray-800 px-2 py-1 rounded">
                                                        {item.akun_email}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Password:</span>
                                                    <span className="ml-2 font-mono text-white bg-gray-800 px-2 py-1 rounded">
                                                        {item.akun_password}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {pesanan.status === 'PENDING' && (
                                        <div className="mt-3 pt-3 border-t border-gray-700">
                                            <p className="text-sm text-yellow-400">
                                                Email dan password akan tersedia setelah pembayaran berhasil.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {pesanan.status === 'COMPLETED' && (
                            <p className="text-sm text-yellow-400 mt-4">
                                ⚠️ Harap segera ganti password dan amankan semua akun Anda.
                            </p>
                        )}
                    </div>
                )}

                {/* Crypto Payment Details - for both single purchase and cart order */}
                {pesanan.payment_method && pesanan.payment_method.startsWith('CRYPTO_') && pesanan.status === 'PENDING' && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Detail Pembayaran Crypto</h2>
                        <div className="space-y-3 bg-gray-900/50 rounded-lg p-4">
                            {pesanan.crypto_address && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Wallet Address</label>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-white font-mono bg-gray-800 px-3 py-2 rounded flex-1 break-all text-sm">
                                            {pesanan.crypto_address}
                                        </p>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(pesanan.crypto_address);
                                                toast.success('Wallet address berhasil disalin!');
                                            }}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm"
                                        >
                                            Salin
                                        </button>
                                    </div>
                                </div>
                            )}
                            {pesanan.crypto_amount && pesanan.crypto_currency && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Jumlah yang Harus Dibayar</label>
                                    <p className="text-white text-lg font-bold">
                                        {pesanan.crypto_amount} {pesanan.crypto_currency}
                                    </p>
                                </div>
                            )}
                            {!pesanan.crypto_tx_hash && (
                                <div className="bg-yellow-900/30 border border-yellow-700 rounded p-3">
                                    <p className="text-yellow-400 text-sm mb-3">
                                        ⚠️ Setelah melakukan pembayaran, submit transaction hash di bawah:
                                    </p>
                                    <input
                                        id="detail_tx_hash"
                                        type="text"
                                        placeholder="Masukkan transaction hash"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 mb-2"
                                    />
                                    <button
                                        onClick={async () => {
                                            const txHash = document.getElementById('detail_tx_hash').value;
                                            if (!txHash) {
                                                toast.error('Masukkan transaction hash');
                                                return;
                                            }
                                            try {
                                                const res = await apiClient.post('/pembelian/verify-crypto/', {
                                                    kode_transaksi: pesanan.kode_transaksi,
                                                    tx_hash: txHash,
                                                });
                                                toast.success(res.data.message || 'Transaction hash berhasil disubmit!');
                                                // Refresh page data
                                                window.location.reload();
                                            } catch (err) {
                                                toast.error(err.response?.data?.error || 'Gagal submit transaction hash');
                                            }
                                        }}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
                                    >
                                        Submit Transaction Hash
                                    </button>
                                </div>
                            )}
                            {pesanan.crypto_tx_hash && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Transaction Hash</label>
                                    <p className="text-white font-mono bg-gray-800 px-3 py-2 rounded break-all text-sm">
                                        {pesanan.crypto_tx_hash}
                                    </p>
                                    {pesanan.crypto_confirmed_at && (
                                        <p className="text-green-400 text-sm mt-2">✅ Dikonfirmasi pada {new Date(pesanan.crypto_confirmed_at).toLocaleString('id-ID')}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Download Invoice Button */}
                {(pesanan.status === 'COMPLETED' || pesanan.status === 'PENDING') && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <a
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/pembelian/invoice/${pesanan.kode_transaksi}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Invoice PDF
                        </a>
                    </div>
                )}

                {/* Single Account Purchase */}
                {pesanan.tipe === 'Akun' && pesanan.status === 'COMPLETED' && !isCartOrder && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Data Akun</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Email/Username Akun:</span>
                                <span className="font-semibold text-white font-mono bg-gray-900 px-3 py-1 rounded">
                                    {pesanan.akun_email_decrypted}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Password Akun:</span>
                                <span className="font-semibold text-white font-mono bg-gray-900 px-3 py-1 rounded">
                                    {pesanan.akun_password_decrypted}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-yellow-400 mt-4">⚠️ Harap segera ganti password dan amankan akun Anda.</p>
                    </div>
                )}
                
                {pesanan.tipe === 'Akun' && pesanan.status === 'COMPLETED' && (
                     <div className="mt-6 pt-6 border-t border-gray-700">
                         <h2 className="text-xl font-semibold text-white mb-4">
                            {pesanan.rating ? 'Ulasan Anda' : 'Beri Ulasan'}
                         </h2>
                         {pesanan.rating ? (
                            <div>
                                <div className="flex items-center space-x-1 text-yellow-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < pesanan.rating ? 'fill-current' : 'text-gray-600'}`} viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.09l6.572-.955L10 0l2.939 6.135 6.572.955-4.756 4.455 1.123 6.545z"/></svg>
                                    ))}
                                </div>
                                <p className="text-gray-300 italic">"{pesanan.ulasan || 'Tidak ada komentar.'}"</p>
                            </div>
                         ) : (
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Rating Anda</label>
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, index) => {
                                            const ratingValue = index + 1;
                                            return (
                                                <button
                                                    type="button"
                                                    key={ratingValue}
                                                    onClick={() => setRating(ratingValue)}
                                                    className={`p-1 rounded-full ${ratingValue <= rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500'}`}
                                                >
                                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.09l6.572-.955L10 0l2.939 6.135 6.572.955-4.756 4.455 1.123 6.545z"/></svg>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="ulasan" className="block text-sm font-medium text-gray-300">Komentar (Opsional)</label>
                                    <textarea
                                        id="ulasan"
                                        rows="3"
                                        value={ulasanText}
                                        onChange={(e) => setUlasanText(e.target.value)}
                                        className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:border-purple-500"
                                        placeholder="Bagaimana pengalaman Anda dengan akun ini?"
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSubmittingReview}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
                                >
                                    {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                                </button>
                            </form>
                         )}
                     </div>
                )}
            </div>
        </div>
    );
}

export default PurchaseDetailPage;