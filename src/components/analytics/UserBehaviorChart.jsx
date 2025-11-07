import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold mb-2">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].payload.fill }}>
          Jumlah: {payload[0].value.toLocaleString('id-ID')}
        </p>
      </div>
    );
  }
  return null;
};

function UserBehaviorChart({ data }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  const chartData = [
    { name: 'New Users (Last 30 Days)', value: data.new_users_last_30 || 0 },
    { name: 'Returning Users', value: data.returning_users || 0 },
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
          <span className="text-sm text-gray-300">New Users (Last 30 Days)</span>
          <span className="text-sm font-semibold text-green-400">
            {data.new_users_last_30?.toLocaleString('id-ID') || 0}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
          <span className="text-sm text-gray-300">Returning Users</span>
          <span className="text-sm font-semibold text-blue-400">
            {data.returning_users?.toLocaleString('id-ID') || 0}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-700/50 rounded border-t border-gray-600 mt-2 pt-2">
          <span className="text-sm font-semibold text-white">Total Active Users</span>
          <span className="text-sm font-bold text-white">
            {data.total_active_users?.toLocaleString('id-ID') || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserBehaviorChart;

