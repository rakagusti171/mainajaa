// frontend/src/pages/admin/ProductAddTopUpPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';

function ProductAddTopUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    game: 'Mobile Legends', // Default
    nama_paket: '',
    harga: '',
  });
  const [gambar, setGambar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setGambar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gambar) {
      toast.error('Gambar produk wajib diisi.');
      return;
    }

    setLoading(true);

    const dataToSubmit = new FormData();
    dataToSubmit.append('game', formData.game);
    dataToSubmit.append('nama_paket', formData.nama_paket);
    dataToSubmit.append('harga', formData.harga);
    dataToSubmit.append('gambar', gambar);

    try {
      await apiClient.post('/admin/topup/create/', dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Produk Top Up berhasil ditambahkan!');
      navigate('/dashboard/produk');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal menambahkan produk.';
      toast.error(`Gagal: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Tambah Produk Top Up Baru</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Game*</label>
          <select
            name="game"
            value={formData.game}
            onChange={handleChange}
            className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
          >
            <option value="Mobile Legends">Mobile Legends</option>
            <option value="PUBG Mobile">PUBG Mobile</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Nama Paket*</label>
          <input
            type="text"
            name="nama_paket"
            value={formData.nama_paket}
            onChange={handleChange}
            required
            placeholder="Contoh: 100 Diamonds"
            className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Harga (Rp)*</label>
          <input
            type="number"
            name="harga"
            value={formData.harga}
            onChange={handleChange}
            required
            placeholder="Contoh: 25000"
            className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Gambar Produk*</label>
          <input
            type="file"
            name="gambar"
            onChange={handleFileChange}
            required
            accept="image/*"
            className="w-full mt-1 text-gray-300"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <Link
            to="/dashboard/produk"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ProductAddTopUpPage;