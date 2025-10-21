// frontend/src/pages/admin/ProductEditTopUpPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';

function ProductEditTopUpPage() {
  const { id: topupId } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    game: 'Mobile Legends',
    nama_paket: '',
    harga: '',
  });

  const [currentImage, setCurrentImage] = useState(null); // Gambar saat ini
  const [gambarBaru, setGambarBaru] = useState(null);    // File gambar baru
  const [loading, setLoading] = useState(true);

  // 1. Ambil data produk yang ada
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/admin/topup/${topupId}/detail/`);
        const data = res.data;

        setFormData({
          game: data.game,
          nama_paket: data.nama_paket,
          harga: data.harga,
        });
        setCurrentImage(data.gambar); // Simpan URL gambar saat ini

      } catch (err) {
        toast.error('Gagal memuat data produk.');
        navigate('/dashboard/produk'); // Kembali jika gagal load
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [topupId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setGambarBaru(e.target.files[0]);
  };

  // 2. Fungsi submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = new FormData();
    dataToSubmit.append('game', formData.game);
    dataToSubmit.append('nama_paket', formData.nama_paket);
    dataToSubmit.append('harga', formData.harga);

    // Tambahkan gambar baru HANYA jika ada
    if (gambarBaru) {
      dataToSubmit.append('gambar', gambarBaru);
    }

    try {
      await apiClient.post(`/admin/topup/${topupId}/update/`, dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Produk Top Up berhasil diperbarui!');
      navigate('/dashboard/produk');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal memperbarui produk.';
      toast.error(`Gagal: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.nama_paket) {
    return <div className="p-8 text-gray-400">Memuat data produk...</div>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Edit Produk Top Up: {formData.nama_paket}</h1>

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
            className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Gambar Produk</label>
          {currentImage && <img src={currentImage} alt="Gambar saat ini" className="w-32 h-auto object-cover rounded-md my-2" />}
          <input
            type="file"
            name="gambarBaru"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full mt-1 text-gray-300"
          />
           <p className="text-xs text-gray-400">Upload file baru untuk mengganti gambar di atas.</p>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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

export default ProductEditTopUpPage;