import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const COLORS = ['#9333EA', '#3B82F6'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold mb-2">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].payload.fill }}>
          Revenue: {formatRupiah(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

function RevenueByTypeChart({ data }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  const chartData = [
    { name: 'Accounts', value: data.accounts || 0 },
    { name: 'Top Ups', value: data.topups || 0 },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) => 
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
          <span className="text-sm text-gray-300">Accounts</span>
          <span className="text-sm font-semibold text-purple-400">
            {formatRupiah(data.accounts || 0)}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
          <span className="text-sm text-gray-300">Top Ups</span>
          <span className="text-sm font-semibold text-blue-400">
            {formatRupiah(data.topups || 0)}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-700/50 rounded border-t border-gray-600 mt-2 pt-2">
          <span className="text-sm font-semibold text-white">Total Revenue</span>
          <span className="text-sm font-bold text-white">
            {formatRupiah(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RevenueByTypeChart;

