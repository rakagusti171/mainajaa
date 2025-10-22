import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { toast } from 'react-hot-toast';

function ResetPasswordPage() {
  const { uid, token } = useParams(); 
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError('Password tidak cocok.');
      toast.error('Password tidak cocok.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await apiClient.post('/password-reset/confirm/', {
        uidb64: uid,
        token: token,
        new_password: password,
      });
      setSuccess(res.data.success);
      toast.success(res.data.success);
      // Arahkan ke login setelah 3 detik
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal mereset password.';
      // Cek jika error adalah array (dari validasi password)
      const displayError = Array.isArray(errorMsg) ? errorMsg.join(' ') : errorMsg;
      setError(displayError);
      toast.error(displayError);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-md">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Reset Berhasil</h1>
          <div className="p-4 bg-green-900/50 border border-green-700 rounded-md text-green-300">
            {success}
          </div>
          <p className="text-gray-400 mt-4">Anda akan diarahkan ke halaman Login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Atur Password Baru</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Password Baru</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;