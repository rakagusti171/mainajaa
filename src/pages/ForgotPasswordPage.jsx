// frontend/src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { toast } from 'react-hot-toast';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Untuk pesan sukses

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await apiClient.post('/password-reset/', { email });
      // Kita selalu tampilkan pesan sukses, apa pun responsnya (demi keamanan)
      setMessage(res.data.success || 'Jika email terdaftar, link reset telah dikirim.');
      toast.success('Permintaan reset terkirim!');
      setEmail(''); // Kosongkan field
    } catch (err) {
      // Bahkan jika error, kita tampilkan pesan 'sukses' generik
      setMessage('Jika email terdaftar, link reset telah dikirim.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Lupa Password</h1>

        {message ? (
          <div className="text-center p-4 bg-green-900/50 border border-green-700 rounded-md text-green-300">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-400 text-center">
              Masukkan alamat email Anda. Kami akan mengirimkan link untuk mereset password Anda.
            </p>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Alamat Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-purple-400 hover:text-purple-300">
            &larr; Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;