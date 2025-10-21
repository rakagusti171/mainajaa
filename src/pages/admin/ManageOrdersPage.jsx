// frontend/src/pages/admin/ManageOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig'; // Perhatikan path ../../

// Helper untuk format
const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
});
const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

// Helper untuk styling status
const getStatusClass = (status) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-900 text-green-300';
    case 'PENDING': return 'bg-yellow-900 text-yellow-300';
    case 'CANCELED': return 'bg-red-900 text-red-300';
    default: return 'bg-gray-700 text-gray-300';
  }
};

function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Panggil API admin baru yang kita buat
        const res = await apiClient.get('/admin/all-orders/');
        setOrders(res.data);
      } catch (err) {
        setError('Gagal memuat pesanan. Pastikan Anda adalah admin.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []); // [] berarti hanya dijalankan sekali saat komponen dimuat

  if (loading) return <div className="p-8 text-gray-400">Memuat semua pesanan...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Kelola Semua Pesanan</h1>
      
      {/* Container Tabel */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          {/* Header Tabel */}
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tipe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Pembeli</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Aksi</th>
            </tr>
          </thead>
          {/* Body Tabel */}
          <tbody className="divide-y divide-gray-700">
            {orders.map(order => (
              <tr key={order.kode_transaksi} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{order.tipe}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.nama_item}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.pembeli_username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(order.dibuat_pada)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{formatHarga(order.harga_total)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {/* Kita bisa tambahkan link detail nanti */}
                  <button className="text-purple-400 hover:text-purple-300">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageOrdersPage;