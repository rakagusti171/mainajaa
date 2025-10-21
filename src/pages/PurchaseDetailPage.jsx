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
    
    // State untuk Form Ulasan
    const [rating, setRating] = useState(0);
    const [ulasanText, setUlasanText] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        if (!kodeTransaksi || !user) return;

        const fetchPesanan = async () => {
            try {
                setLoading(true);
                setError('');
                // Panggil API yang sudah kita buat
                const res = await apiClient.get(`/pembelian/detail/${kodeTransaksi}/`);
                setPesanan(res.data);
                
                // Set state ulasan jika sudah ada
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
    }, [kodeTransaksi, user]); // Jalankan ulang jika kodeTransaksi berubah

    // Fungsi untuk Submit Ulasan
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Harap berikan rating bintang.');
            return;
        }
        
        setIsSubmittingReview(true);
        try {
            // Panggil API ulasan yang sudah kita buat
            const res = await apiClient.post(`/pembelian/review/${pesanan.id}/`, {
                rating: rating,
                ulasan: ulasanText
            });
            toast.success('Ulasan berhasil dikirim!');
            
            // Update state pesanan secara lokal dengan data dari respons
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

    // Helper
    const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;
    const formatTanggal = (tanggal) => new Date(tanggal).toLocaleString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    
    // Tampilan Loading / Error
    if (loading) return <div className="text-center p-20 text-gray-400">Memuat detail pesanan...</div>;
    if (error) return <div className="text-center p-20 text-red-400">{error}</div>;
    if (!pesanan) return <div className="text-center p-20 text-gray-400">Pesanan tidak ditemukan.</div>;

    // Tampilan Data
    return (
        <div className="container mx-auto px-6 py-8 max-w-2xl">
            <div className="mb-4 text-sm text-gray-400">
                <Link to="/profil" className="hover:text-white">Profil</Link>
                <span className="mx-2">&gt;</span>
                <span className="text-white">Detail Pesanan</span>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
                <h1 className="text-2xl font-bold text-white mb-4">Detail Pesanan</h1>
                <p className="text-lg text-purple-400 font-mono mb-6">{pesanan.kode_transaksi}</p>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`font-semibold ${pesanan.status === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {pesanan.status}
                        </span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Item:</span>
                        <span className="font-semibold text-white">{pesanan.nama_item}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Tanggal:</span>
                        <span className="font-semibold text-white">{formatTanggal(pesanan.tanggal)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Total Bayar:</span>
                        <span className="font-semibold text-white">{formatHarga(pesanan.total)}</span>
                    </div>
                    {/* Detail spesifik TopUp */}
                    {pesanan.tipe === 'TopUp' && (
                         <div className="flex justify-between">
                            <span className="text-gray-400">Game ID:</span>
                            <span className="font-semibold text-white">
                                {pesanan.game_user_id} {pesanan.game_zone_id ? `(${pesanan.game_zone_id})` : ''}
                            </span>
                        </div>
                    )}
                </div>

                {/* Tampilkan Data Akun jika Tipe Akun & Lunas */}
                {pesanan.tipe === 'Akun' && pesanan.status === 'COMPLETED' && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Data Akun</h2>
                        <div className="space-y-3">
                             <div className="flex justify-between">
                                <span className="text-gray-400">Email/Username Akun:</span>
                                <span className="font-semibold text-white">{pesanan.akun_email_decrypted}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-400">Password Akun:</span>
                                <span className="font-semibold text-white">{pesanan.akun_password_decrypted}</span>
                            </div>
                        </div>
                         <p className="text-sm text-yellow-400 mt-4">Harap segera ganti password dan amankan akun Anda.</p>
                    </div>
                )}
                
                {/* Form Ulasan (Hanya untuk Tipe Akun & Lunas) */}
                {pesanan.tipe === 'Akun' && pesanan.status === 'COMPLETED' && (
                     <div className="mt-6 pt-6 border-t border-gray-700">
                         <h2 className="text-xl font-semibold text-white mb-4">
                            {pesanan.rating ? 'Ulasan Anda' : 'Beri Ulasan'}
                         </h2>
                         {/* Tampilkan ulasan jika sudah ada */}
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
                            /* Tampilkan form jika belum ada ulasan */
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