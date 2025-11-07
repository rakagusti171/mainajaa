import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { StatCardSkeleton } from '../../components/LoadingSkeleton';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, month

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/admin/analytics/');
        setAnalytics(res.data);
      } catch (err) {
        setError('Gagal memuat data analytics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (error) return <div className="p-4 sm:p-6 lg:p-8 text-red-400 text-sm sm:text-base">{error}</div>;

  const revenueChange = analytics
    ? ((analytics.revenue.today - analytics.revenue.yesterday) / (analytics.revenue.yesterday || 1)) * 100
    : 0;

  const revenueChange7d = analytics
    ? ((analytics.revenue.last_7_days - analytics.revenue.last_month) / (analytics.revenue.last_month || 1)) * 100
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              timeRange === '7d'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            7 Hari
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              timeRange === '30d'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            30 Hari
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              timeRange === 'month'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Bulan Ini
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : analytics ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase">Revenue Hari Ini</h3>
                <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                {formatRupiah(analytics.revenue.today)}
              </p>
              <div className="flex items-center text-xs sm:text-sm">
                {revenueChange >= 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span className={revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {Math.abs(revenueChange).toFixed(1)}% dari kemarin
                </span>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase">Revenue 7 Hari</h3>
                <ChartBarIcon className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                {formatRupiah(analytics.revenue.last_7_days)}
              </p>
              <div className="flex items-center text-xs sm:text-sm">
                {revenueChange7d >= 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span className={revenueChange7d >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {Math.abs(revenueChange7d).toFixed(1)}% dari bulan lalu
                </span>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase">Total Users</h3>
                <UserGroupIcon className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {analytics.summary.total_users.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase">Total Orders</h3>
                <ShoppingBagIcon className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {analytics.summary.total_orders.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase">Revenue 30 Hari</h3>
                <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {formatRupiah(analytics.revenue.last_30_days)}
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase">Conversion Rate</h3>
                <ChartBarIcon className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {analytics.summary.conversion_rate}%
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase">Avg Order Value</h3>
                <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {formatRupiah(analytics.summary.avg_order_value)}
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase">Total Products</h3>
                <ShoppingBagIcon className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {analytics.summary.total_products.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Daily Revenue Chart */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Revenue 7 Hari Terakhir</h2>
              <div className="space-y-3">
                {analytics.revenue.daily.map((day, index) => {
                  const maxRevenue = Math.max(...analytics.revenue.daily.map(d => d.revenue));
                  const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-xs sm:text-sm text-gray-400 w-16 sm:w-20 flex-shrink-0">
                        {formatDate(day.date)}
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-6 sm:h-8 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full flex items-center justify-end pr-2 sm:pr-3 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-xs font-semibold text-white">
                            {formatRupiah(day.revenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sales by Game */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Penjualan per Game</h2>
              <div className="space-y-3">
                {analytics.sales_by_game.length > 0 ? (
                  analytics.sales_by_game.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-white">{item.game}</p>
                        <p className="text-xs text-gray-400">{item.count} penjualan</p>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-purple-400">
                        {formatRupiah(item.revenue)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Belum ada data penjualan</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Top Products */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Produk Terlaris</h2>
              <div className="space-y-3">
                {analytics.top_products.accounts && analytics.top_products.accounts.length > 0 ? (
                  analytics.top_products.accounts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-white">{product.akun__nama_akun || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{product.akun__game || 'Unknown'} • {product.sales_count || 0} penjualan</p>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-purple-400">
                        {formatRupiah(product.akun__harga || 0)}
                      </p>
                    </div>
                  ))
                ) : null}
                {analytics.top_products.topups && analytics.top_products.topups.length > 0 ? (
                  analytics.top_products.topups.map((product, index) => (
                    <div key={`topup-${index}`} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-white">{product.produk__nama_paket || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{product.produk__game || 'Unknown'} • {product.sales_count || 0} penjualan</p>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-purple-400">
                        {formatRupiah(product.produk__harga || 0)}
                      </p>
                    </div>
                  ))
                ) : null}
                {(!analytics.top_products.accounts || analytics.top_products.accounts.length === 0) &&
                 (!analytics.top_products.topups || analytics.top_products.topups.length === 0) && (
                  <p className="text-gray-400 text-sm">Belum ada data</p>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Pesanan Terbaru</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {analytics.recent_orders.length > 0 ? (
                  analytics.recent_orders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-white truncate">{order.item_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            order.type === 'AKUN' ? 'bg-blue-600/20 text-blue-400' : 'bg-green-600/20 text-green-400'
                          }`}>
                            {order.type}
                          </span>
                          <span className="text-xs text-gray-400">{order.customer}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.date).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right ml-3">
                        <p className="text-sm sm:text-base font-bold text-purple-400">
                          {formatRupiah(order.amount)}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          order.status === 'COMPLETED' ? 'bg-green-600/20 text-green-400' :
                          order.status === 'PENDING' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Belum ada pesanan</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default AnalyticsPage;

