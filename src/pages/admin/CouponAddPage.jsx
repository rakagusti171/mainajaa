import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';

function CouponAddPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kode: '',
    diskon_persen: '',
    aktif: true, 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post('/admin/coupon/create/', {
        kode: formData.kode,
        diskon_persen: formData.diskon_persen,
        aktif: formData.aktif,
      });
      toast.success('Kupon berhasil ditambahkan!');
      navigate('/dashboard/kupon');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal menambahkan kupon.';
      toast.error(`Gagal: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Tambah Kupon Baru</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Kode Kupon*</label>
          <input
            type="text"
            name="kode"
            value={formData.kode}
            onChange={handleChange}
            required
            maxLength="20"
            placeholder="Contoh: DISKONBARU"
            className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 uppercase"
          />
           <p className="text-xs text-gray-400 mt-1">Hanya huruf dan angka, tanpa spasi. Akan disimpan dalam huruf besar.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Diskon Persen (%)*</label>
          <input
            type="number"
            name="diskon_persen"
            value={formData.diskon_persen}
            onChange={handleChange}
            required
            min="1"
            max="100"
            placeholder="1 - 100"
            className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="aktif"
            id="aktif"
            checked={formData.aktif}
            onChange={handleChange}
            className="h-4 w-4 text-purple-600 border-gray-500 rounded focus:ring-purple-500"
          />
          <label htmlFor="aktif" className="ml-2 block text-sm text-gray-300">
            Aktifkan Kupon (Bisa digunakan pelanggan)
          </label>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Kupon'}
          </button>
          <Link
            to="/dashboard/kupon"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CouponAddPage;