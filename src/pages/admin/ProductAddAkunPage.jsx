import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';
import { GAME_CHOICES } from '../../utils/gameConstants'; 

function ProductAddAkunPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_akun: '',
    game: GAME_CHOICES[0], 
    level: '',
    harga: '',
    deskripsi: '',
    akun_email: '',
    akun_password: '',
  });

  const [gambarCover, setGambarCover] = useState(null);
  const [gambarGaleri, setGambarGaleri] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCoverFileChange = (e) => {
    setGambarCover(e.target.files[0]);
  };

  const handleGalleryFileChange = (e) => {
    setGambarGaleri(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gambarCover) {
      toast.error('Gambar Cover produk wajib diisi.');
      return;
    }
    if (!formData.akun_email || !formData.akun_password) {
      toast.error('Email/Username dan Password Akun Game wajib diisi.');
      return;
    }
    if (!formData.game) {
       toast.error('Silakan pilih jenis game.');
       return;
    }

    setLoading(true);

    const dataToSubmit = new FormData();
    dataToSubmit.append('nama_akun', formData.nama_akun);
    dataToSubmit.append('game', formData.game);
    dataToSubmit.append('level', formData.level);
    dataToSubmit.append('harga', formData.harga);
    dataToSubmit.append('deskripsi', formData.deskripsi);
    dataToSubmit.append('akun_email', formData.akun_email);
    dataToSubmit.append('akun_password', formData.akun_password);
    dataToSubmit.append('gambar', gambarCover);

    if (gambarGaleri) {
      for (let i = 0; i < gambarGaleri.length; i++) {
        dataToSubmit.append('images[]', gambarGaleri[i]);
      }
    }

    try {
      await apiClient.post('/admin/akun/create/', dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Akun Gaming berhasil ditambahkan!');
      navigate('/dashboard/produk');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal menambahkan produk.';
      toast.error(`Gagal: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Tambah Akun Gaming Baru</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
         <div>
          <label className="block text-sm font-medium text-gray-300">Nama Akun*</label>
          <input type="text" name="nama_akun" value={formData.nama_akun} onChange={handleChange} required className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Game*</label>
            <select name="game" value={formData.game} onChange={handleChange} required className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200">
              <option value="" disabled>Pilih Game</option>
              {GAME_CHOICES.map(gameName => (
                <option key={gameName} value={gameName}>
                  {gameName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Level</label>
            <input type="number" name="level" value={formData.level} onChange={handleChange} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Harga (Rp)*</label>
          <input type="number" name="harga" value={formData.harga} onChange={handleChange} required placeholder="Contoh: 150000" className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Email/Username Akun Game*</label>
          <input
            type="text"
            name="akun_email"
            value={formData.akun_email}
            onChange={handleChange}
            required
            placeholder="Email atau username login game"
            className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Password Akun Game*</label>
          <input
            type="password"
            name="akun_password"
            value={formData.akun_password}
            onChange={handleChange}
            required
            placeholder="Password login game"
            className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
          />
        </div>
        
         <div>
          <label className="block text-sm font-medium text-gray-300">Deskripsi</label>
          <textarea name="deskripsi" rows="4" value={formData.deskripsi} onChange={handleChange} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Gambar Cover (Utama)*</label>
          <input type="file" name="gambarCover" onChange={handleCoverFileChange} required accept="image/*" className="w-full mt-1 text-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Gambar Galeri (Opsional, bisa lebih dari satu)</label>
          <input type="file" name="gambarGaleri" onChange={handleGalleryFileChange} accept="image/*" multiple className="w-full mt-1 text-gray-300" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 sm:px-6 rounded-md disabled:opacity-50 text-sm sm:text-base">
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <Link to="/dashboard/produk" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 sm:px-6 rounded-md text-center text-sm sm:text-base">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ProductAddAkunPage;