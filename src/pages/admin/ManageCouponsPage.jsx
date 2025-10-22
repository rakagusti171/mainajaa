import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', {
  day: '2-digit', month: 'short', year: 'numeric'
});

function ManageCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/admin/all-coupons/');
        setCoupons(res.data);
      } catch (err) {
        setError('Gagal memuat kupon.');
        toast.error('Gagal memuat kupon.');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleToggleActive = async (id) => {
    try {
      const originalCoupons = [...coupons];
      setCoupons(currentCoupons =>
        currentCoupons.map(coupon =>
          coupon.id === id ? { ...coupon, aktif: !coupon.aktif } : coupon
        )
      );
      await apiClient.post(`/admin/coupon/${id}/toggle-active/`);
      toast.success('Status kupon berhasil diubah.');

    } catch (err) {
      toast.error('Gagal mengubah status kupon.');
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Memuat kupon...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kelola Kupon</h1>
        <Link
          to="/dashboard/kupon/tambah"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
        >
          + Tambah Kupon Baru
        </Link>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Kode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Diskon (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Jumlah Pengguna</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Dibuat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {coupons.length > 0 ? (
              coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{coupon.kode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{coupon.diskon_persen}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      coupon.aktif ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {coupon.aktif ? 'AKTIF' : 'NONAKTIF'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{coupon.jumlah_pengguna}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(coupon.dibuat_pada)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleToggleActive(coupon.id)}
                      className={`font-semibold ${
                        coupon.aktif ? 'text-red-500 hover:text-red-400' : 'text-green-500 hover:text-green-400'
                      }`}
                    >
                      {coupon.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  Belum ada kupon.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCouponsPage;