import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = {
  'COMPLETED': '#10B981',
  'PENDING': '#F59E0B',
  'CANCELED': '#EF4444',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold mb-2">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].payload.fill }}>
          Jumlah: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

function OrderStatusChart({ data }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count,
    fill: COLORS[status] || '#6B7280',
  }));

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
              `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">Total Orders: <span className="text-white font-semibold">{total}</span></p>
      </div>
    </div>
  );
}

export default OrderStatusChart;

