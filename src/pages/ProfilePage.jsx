import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const settings = {
    MIDTRANS_SNAP_URL: import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js',
    MIDTRANS_CLIENT_KEY: import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'GANTI_DENGAN_CLIENT_KEY_ANDA'
};

const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;
const formatTanggal = (tanggal) => new Date(tanggal).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
});

const formatJoinDate = (isoString) => {
    if (!isoString) return 'Tidak diketahui';
    return new Date(isoString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const StatusBadge = ({ status }) => {
    let colorClass = '';
    switch (status) {
        case 'PENDING': colorClass = 'bg-yellow-600/50 text-yellow-300 border-yellow-500'; break;
        case 'COMPLETED': colorClass = 'bg-green-600/50 text-green-300 border-green-500'; break;
        case 'CANCELED': colorClass = 'bg-red-600/50 text-red-300 border-red-500'; break;
        default: colorClass = 'bg-gray-600/50 text-gray-300 border-gray-500';
    }
    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colorClass}`}>
            {status}
        </span>
    );
};

const ProfilSayaTab = () => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    console.log("Data User dari AuthContext:", user);

    if (!user) {
        return <div className="text-gray-400 p-4 text-center">{t('loadingUser')}</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">{t('myProfile')}</h2>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex flex-col space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400 text-sm sm:text-base">{t('username')}:</span>
                        <span className="font-semibold text-white text-base sm:text-lg">{user.username}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400 text-sm sm:text-base">{t('email')}:</span>
                        <span className="font-semibold text-white text-base sm:text-lg">{user.email}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RiwayatPembelianTab = () => {
    const [riwayat, setRiwayat] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        const fetchRiwayat = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/pembelian/history/');
                setRiwayat(res.data);
            } catch (err) {
                toast.error(t('failedToLoad') + ' ' + t('purchaseHistory').toLowerCase());
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRiwayat();
    }, []);

    const handleLanjutkanBayar = (token) => {
        if (window.snap) {
            window.snap.pay(token, {
                onSuccess: (result) => {
                    toast.success(t('paymentSuccess'));
                    navigate(0); 
                },
                onPending: (result) => {
                    toast(t('waitingPayment'), { icon: '⏳' });
                },
                onError: (result) => {
                    toast.error(t('paymentFailedMsg'));
                },
                onClose: () => {
                    toast.info(t('paymentClosed'));
                }
            });
        } else {
            toast.error(t('paymentNotReady'));
        }
    };

    if (loading) return <div className="text-gray-400 p-4 text-center">{t('loadingHistory')}</div>;
    if (riwayat.length === 0) return <div className="text-gray-500 p-4 text-center">{t('noPurchaseHistory')}</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">{t('item')}</th>
                        <th scope="col" className="px-6 py-3">{t('date')}</th>
                        <th scope="col" className="px-6 py-3">{t('total')}</th>
                        <th scope="col" className="px-6 py-3">{t('status')}</th>
                        <th scope="col" className="px-6 py-3">{t('action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {riwayat.map(item => (
                        <tr key={item.kode_transaksi} className="bg-gray-800/60 border-b border-gray-700 hover:bg-gray-700/60">
                            <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                {item.nama_item}
                                <span className={`ml-2 text-xs ${item.tipe === 'Akun' ? 'text-purple-400' : 'text-blue-400'}`}>
                                    ({item.tipe})
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatTanggal(item.tanggal)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatHarga(item.total)}</td>
                            <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {item.status === 'PENDING' && (
                                    <button onClick={() => handleLanjutkanBayar(item.midtrans_token)} className="font-medium text-blue-400 hover:underline">
                                        {t('continuePayment')}
                                    </button>
                                )}
                                {item.status === 'COMPLETED' && (
                                    <Link to={`/profil/pesanan/${item.kode_transaksi}`} className="font-medium text-green-400 hover:underline">
                                        {t('viewDetail')}
                                    </Link>
                                )}
                                 {item.status === 'CANCELED' && (
                                    <span className="text-gray-500">{t('canceled')}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AkunFavoritTab = () => {
    const [favorit, setFavorit] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchFavorit = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/accounts/favorit/');
                setFavorit(res.data);
            } catch (err) {
                toast.error(t('failedToLoadFavorites'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorit();
    }, []);

    if (loading) return <div className="text-gray-400 p-4 text-center">{t('loadingFavorites')}</div>;
    if (favorit.length === 0) return <div className="text-gray-500 p-4 text-center">{t('noFavorites')}</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorit.map(akun => (
                <Link 
                  key={akun.id} 
                  to={`/akun/${akun.id}`}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col"
                >
                  <img className="h-40 w-full object-cover" src={akun.gambar} alt={akun.nama_akun} />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-md font-semibold text-white">{akun.nama_akun}</h3>
                    <p className="text-sm text-gray-400">{akun.game}</p>
                    <p className="mt-3 text-lg font-bold text-purple-400 flex-grow">
                      {formatHarga(akun.harga)}
                    </p>
                    <span className="mt-3 block text-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-md text-sm">
                      {t('viewDetails')}
                    </span>
                  </div>
                </Link>
            ))}
        </div>
    );
};

const UbahPasswordTab = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error(t('passwordMismatch'));
            return;
        }
        setLoading(true);
        try {
            await apiClient.patch('/change-password/', {
                old_password: oldPassword,
                new_password: newPassword,
            });
            toast.success(t('passwordChanged'));
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            const errorMsg = err.response?.data?.old_password || err.response?.data?.error || [t('passwordChangeFailed')];
            toast.error(Array.isArray(errorMsg) ? errorMsg.join(' ') : t('passwordChangeFailed'));
            console.error(err.response.data);
        } finally {
            setLoading(false);
        }
    };
    
    return (
         <div className="max-w-lg mx-auto">
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">{t('oldPassword')}</label>
                    <input 
                        type="password" 
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300">{t('newPassword')}</label>
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300">{t('confirmNewPassword')}</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50"
                >
                    {loading ? t('saving') : t('saveChanges')}
                </button>
             </form>
         </div>
    );
};

function ProfilPage() {
    const [activeTab, setActiveTab] = useState('profil'); 
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
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

    const handleLogout = () => {
        logoutUser();
        toast.success(t('loggedOut'));
        navigate('/');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profil':
                return <ProfilSayaTab />;
            case 'riwayat':
                return <RiwayatPembelianTab />;
            case 'favorit':
                return <AkunFavoritTab />;
            case 'password':
                return <UbahPasswordTab />;
            default:
                return null;
        }
    };

    const TabButton = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === tabName 
                ? 'bg-purple-600 text-white font-semibold' 
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">{t('userProfile')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Kolom Kiri: Navigasi Tab */}
                <div className="md:col-span-1">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-2">
                        <TabButton tabName="profil" label={t('myProfile')} />
                        <TabButton tabName="riwayat" label={t('purchaseHistory')} />
                        <TabButton tabName="favorit" label={t('favoriteAccounts')} />
                        <TabButton tabName="password" label={t('changePassword')} />
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/50 transition-colors"
                        >
                            {t('logout')}
                        </button>
                    </div>
                </div>

                <div className="md:col-span-3">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 min-h-[300px]">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilPage;