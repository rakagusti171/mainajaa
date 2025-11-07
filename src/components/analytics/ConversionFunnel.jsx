import React from 'react';

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

function ConversionFunnel({ data }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  const steps = [
    { key: 'products_viewed', label: 'Products Viewed', value: data.products_viewed || 0 },
    { key: 'products_in_cart', label: 'Products in Cart', value: data.products_in_cart || 0 },
    { key: 'orders_created', label: 'Orders Created', value: data.orders_created || 0 },
    { key: 'orders_completed', label: 'Orders Completed', value: data.orders_completed || 0 },
  ];

  const maxValue = Math.max(...steps.map(s => s.value), 1);

  const calculatePercentage = (value) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  const calculateConversionRate = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current / previous) * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const percentage = calculatePercentage(step.value);
        const conversionRate = index > 0 
          ? calculateConversionRate(step.value, steps[index - 1].value)
          : 100;

        return (
          <div key={step.key} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">{step.label}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  {conversionRate}% conversion
                </span>
                <span className="text-lg font-bold text-white">{step.value.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-8 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              >
                {percentage > 10 && (
                  <span className="text-xs font-semibold text-white">
                    {percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Overall Conversion Rate</h4>
        <p className="text-2xl font-bold text-purple-400">
          {steps[0].value > 0 
            ? ((steps[steps.length - 1].value / steps[0].value) * 100).toFixed(2)
            : 0}%
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {steps[steps.length - 1].value} completed orders dari {steps[0].value} products viewed
        </p>
      </div>
    </div>
  );
}

export default ConversionFunnel;

