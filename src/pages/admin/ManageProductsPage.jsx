import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-hot-toast';

const formatHarga = (harga) => `Rp ${parseFloat(harga).toLocaleString('id-ID')}`;

function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterTipe, setFilterTipe] = useState('semua');
  const [filterGame, setFilterGame] = useState('semua');

  const tipes = ['semua', 'AKUN', 'TOPUP'];
  const games = ['semua', 'Mobile Legends', 'PUBG Mobile', 'Lainnya'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/admin/all-products/', {
          params: {
            tipe: filterTipe,
            game: filterGame
          }
        });
        setProducts(res.data);
      } catch (err) {
        setError('Gagal memuat produk.');
        toast.error('Gagal memuat produk.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filterTipe, filterGame]);

  const handleDelete = async (tipe, id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini? Aksi ini tidak bisa dibatalkan.')) {
      return;
    }

    try {
      await apiClient.post('/admin/product/delete/', { tipe, id });
      setProducts(currentProducts => 
        currentProducts.filter(p => !(p.tipe === tipe && p.id === id))
      );
      toast.success('Produk berhasil dihapus.');
    } catch (err) {
      toast.error('Gagal menghapus produk: ' + (err.response?.data?.error || 'Error server'));
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Memuat semua produk...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="p-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Kelola Produk</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <select 
            value={filterTipe}
            onChange={(e) => setFilterTipe(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-md p-2"
          >
            {tipes.map(t => (
              <option key={t} value={t}>{t === 'semua' ? 'Semua Tipe' : t}</option>
            ))}
          </select>
          
          <select 
            value={filterGame}
            onChange={(e) => setFilterGame(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-md p-2"
          >
            {games.map(g => (
              <option key={g} value={g}>{g === 'semua' ? 'Semua Game' : g}</option>
            ))}
          </select>
          
          <Link 
            to="/dashboard/produk/tambah" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
          >
            + Tambah Produk Baru 
          </Link>
        </div>
      </div>
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Gambar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tipe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Nama Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Harga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.length > 0 ? (
              products.map(product => (
                <tr key={`${product.tipe}-${product.id}`} className="hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <img 
                      src={product.gambar} 
                      alt={product.nama_item} 
                      className="w-16 h-10 object-cover rounded-md border border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    {product.tipe}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{product.nama_item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{formatHarga(product.harga)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status_jual === 'TERSEDIA' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {product.status_jual}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                    {product.tipe === 'AKUN' ? (
                      <Link 
                        to={`/dashboard/produk/edit-akun/${product.id}`}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Edit
                      </Link>
                    ) : ( 
                      <Link 
                        to={`/dashboard/produk/edit-topup/${product.id}`} 
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Edit
                      </Link>
                    )}
                    <button 
                      onClick={() => handleDelete(product.tipe, product.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  Tidak ada produk yang cocok dengan filter Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageProductsPage;