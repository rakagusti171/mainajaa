import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';

function ProductEditAkunPage() {
  const { id: accountId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nama_akun: '',
    game: 'Mobile Legends',
    level: '',
    harga: '',
    deskripsi: '',
  });
  
  const [currentCover, setCurrentCover] = useState(null);
  const [currentGallery, setCurrentGallery] = useState([]);
  
  const [gambarCoverBaru, setGambarCoverBaru] = useState(null);
  const [gambarGaleriBaru, setGambarGaleriBaru] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/admin/akun/${accountId}/detail/`);
        const data = res.data;
        setFormData({
          nama_akun: data.nama_akun,
          game: data.game,
          level: data.level || '',
          harga: data.harga,
          deskripsi: data.deskripsi || '',
        });
        setCurrentCover(data.gambar);
        setCurrentGallery(data.images || []);
      } catch (err) {
        toast.error('Gagal memuat data produk.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [accountId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoverFileChange = (e) => setGambarCoverBaru(e.target.files[0]);
  const handleGalleryFileChange = (e) => setGambarGaleriBaru(e.target.files);
  const toggleDeleteImage = (id) => {
    setImagesToDelete(prev => 
      prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      dataToSubmit.append(key, formData[key]);
    });
    if (gambarCoverBaru) dataToSubmit.append('gambar', gambarCoverBaru);
    if (gambarGaleriBaru) {
      for (let i = 0; i < gambarGaleriBaru.length; i++) {
        dataToSubmit.append('images[]', gambarGaleriBaru[i]);
      }
    }
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach(id => {
        dataToSubmit.append('delete_images[]', id);
      });
    }

    try {
      await apiClient.post(`/admin/akun/${accountId}/update/`, dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Perubahan berhasil!');
      navigate('/dashboard/produk');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal memperbarui produk.';
      toast.error(`Perubahan gagal: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !formData.nama_akun) {
    return <div className="p-4 sm:p-6 lg:p-8 text-gray-400 text-sm sm:text-base">Memuat data produk...</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Edit Akun Gaming: {formData.nama_akun}</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Nama Akun*</label>
          <input type="text" name="nama_akun" value={formData.nama_akun} onChange={handleChange} required className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Game*</label>
            <select name="game" value={formData.game} onChange={handleChange} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200">
              <option value="Mobile Legends">Mobile Legends</option>
              <option value="PUBG Mobile">PUBG Mobile</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Level</label>
            <input type="number" name="level" value={formData.level} onChange={handleChange} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Harga (Rp)*</label>
          <input type="number" name="harga" value={formData.harga} onChange={handleChange} required className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Deskripsi</label>
          <textarea name="deskripsi" rows="4" value={formData.deskripsi} onChange={handleChange} className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Gambar Cover (Utama)</label>
          {currentCover && <img src={currentCover} alt="Cover saat ini" className="w-32 h-32 object-cover rounded-md my-2" />}
          <input type="file" name="gambarCoverBaru" onChange={handleCoverFileChange} accept="image/*" className="w-full mt-1 text-gray-300" />
          <p className="text-xs text-gray-400">Upload file baru untuk mengganti cover di atas.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Gambar Galeri</label>
          <div className="flex flex-wrap gap-2 my-2">
            {currentGallery.map(img => (
              <div key={img.id} className="relative">
                <img src={img.gambar} alt="Galeri" className={`w-24 h-24 object-cover rounded-md ${imagesToDelete.includes(img.id) ? 'opacity-30' : ''}`} />
                <button 
                  type="button"
                  onClick={() => toggleDeleteImage(img.id)}
                  className={`absolute top-1 right-1 w-6 h-6 rounded-full text-white font-bold ${imagesToDelete.includes(img.id) ? 'bg-green-500' : 'bg-red-600'}`}
                >
                  {imagesToDelete.includes(img.id) ? '✓' : 'X'}
                </button>
              </div>
            ))}
          </div>
          <input type="file" name="gambarGaleriBaru" onChange={handleGalleryFileChange} accept="image/*" multiple className="w-full mt-1 text-gray-300" />
          <p className="text-xs text-gray-400">Upload file baru untuk menambah gambar galeri.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 sm:px-6 rounded-md disabled:opacity-50 text-sm sm:text-base">
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <Link to="/dashboard/produk" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 sm:px-6 rounded-md text-center text-sm sm:text-base">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ProductEditAkunPage;