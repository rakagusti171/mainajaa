import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig'; 


const StatCard = ({ title, value, loading }) => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
    <h3 className="text-sm font-medium text-gray-400 uppercase">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-white">
      {loading ? '...' : value}
    </p>
  </div>
);

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

function DashboardHomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/admin/dashboard-stats/');
        setStats(res.data);
      } catch (err) {
        setError('Gagal memuat statistik.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pendapatan"
          value={stats ? formatRupiah(stats.total_revenue) : '...'}
          loading={loading}
        />
        <StatCard 
          title="Akun Tersedia"
          value={stats ? stats.akun_tersedia : '...'}
          loading={loading}
        />
        <StatCard 
          title="Akun Terjual"
          value={stats ? stats.akun_terjual : '...'}
          loading={loading}
        />
        <StatCard 
          title="Top Up Berhasil"
          value={stats ? stats.topup_berhasil : '...'}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default DashboardHomePage;