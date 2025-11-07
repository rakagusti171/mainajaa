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
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import RevenueChart from '../../components/analytics/RevenueChart';
import SalesByGameChart from '../../components/analytics/SalesByGameChart';
import OrderStatusChart from '../../components/analytics/OrderStatusChart';
import ConversionFunnel from '../../components/analytics/ConversionFunnel';
import RevenueByTypeChart from '../../components/analytics/RevenueByTypeChart';
import UserBehaviorChart from '../../components/analytics/UserBehaviorChart';

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
  const [timeRange, setTimeRange] = useState('daily'); // daily, weekly, monthly
  const [chartType, setChartType] = useState('bar'); // bar, pie for sales by game

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

  const exportToCSV = () => {
    if (!analytics) return;
    
    // Prepare CSV data
    let csvContent = 'Analytics Data Export\n\n';
    
    // Summary
    csvContent += 'SUMMARY\n';
    csvContent += `Total Users,${analytics.summary.total_users}\n`;
    csvContent += `Total Products,${analytics.summary.total_products}\n`;
    csvContent += `Total Orders,${analytics.summary.total_orders}\n`;
    csvContent += `Conversion Rate,${analytics.summary.conversion_rate}%\n`;
    csvContent += `Avg Order Value,${analytics.summary.avg_order_value}\n\n`;
    
    // Revenue
    csvContent += 'REVENUE\n';
    csvContent += `Today,${analytics.revenue.today}\n`;
    csvContent += `Last 7 Days,${analytics.revenue.last_7_days}\n`;
    csvContent += `Last 30 Days,${analytics.revenue.last_30_days}\n\n`;
    
    // Daily Revenue
    csvContent += 'DAILY REVENUE\n';
    csvContent += 'Date,Revenue\n';
    analytics.revenue.daily.forEach(day => {
      csvContent += `${day.date},${day.revenue}\n`;
    });
    csvContent += '\n';
    
    // Sales by Game
    csvContent += 'SALES BY GAME\n';
    csvContent += 'Game,Count,Revenue\n';
    analytics.sales_by_game.forEach(item => {
      csvContent += `${item.game},${item.count},${item.revenue}\n`;
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) return <div className="p-4 sm:p-6 lg:p-8 text-red-400 text-sm sm:text-base">{error}</div>;

  const revenueChange = analytics
    ? ((analytics.revenue.today - analytics.revenue.yesterday) / (analytics.revenue.yesterday || 1)) * 100
    : 0;

  const revenueChange7d = analytics
    ? ((analytics.revenue.last_7_days - analytics.revenue.last_month) / (analytics.revenue.last_month || 1)) * 100
    : 0;

  const getRevenueData = () => {
    if (!analytics) return [];
    if (timeRange === 'weekly') return analytics.revenue.weekly || [];
    if (timeRange === 'monthly') return analytics.revenue.monthly || [];
    return analytics.revenue.daily || [];
  };

  const getRevenueType = () => {
    if (timeRange === 'weekly') return 'weekly';
    if (timeRange === 'monthly') return 'monthly';
    return 'daily';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Advanced Analytics Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                timeRange === 'daily'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                timeRange === 'weekly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                timeRange === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Monthly
            </button>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-md text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export CSV
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

          {/* Revenue Trends Chart */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Revenue Trends ({timeRange === 'daily' ? 'Last 7 Days' : timeRange === 'weekly' ? 'Last 4 Weeks' : 'Last 6 Months'})
              </h2>
            </div>
            <RevenueChart data={getRevenueData()} type={getRevenueType()} />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Sales by Game Chart */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white">Sales by Game</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      chartType === 'bar'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setChartType('pie')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      chartType === 'pie'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Pie
                  </button>
                </div>
              </div>
              <SalesByGameChart data={analytics.sales_by_game} chartType={chartType} />
            </div>

            {/* Order Status Chart */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Order Status Breakdown</h2>
              <OrderStatusChart data={analytics.orders.status_breakdown} />
            </div>
          </div>

          {/* Second Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Revenue by Type */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Revenue by Product Type</h2>
              <RevenueByTypeChart data={analytics.revenue_by_type} />
            </div>

            {/* User Behavior */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">User Behavior</h2>
              <UserBehaviorChart data={analytics.user_behavior} />
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Conversion Funnel</h2>
            <ConversionFunnel data={analytics.conversion_funnel} />
          </div>

          {/* Top Products & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Top Products */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Produk Terlaris</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
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

