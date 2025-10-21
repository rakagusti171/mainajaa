import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { toast } from 'react-hot-toast'; // 2. Import toast

function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate(); // 3. Inisialisasi navigate
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 4. Tambah state loading

  // 5. Ubah handleSubmit menjadi async dan tambahkan error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(username, password);
      toast.success('Login berhasil!');
      navigate('/'); // Arahkan ke home setelah sukses
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Login Gagal: Username atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Username</label>
            <input 
              type="text" 
              name="username" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:border-purple-500 focus:ring-purple-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:border-purple-500 focus:ring-purple-500" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} // 6. Tambah disabled state
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        {/* 7. TAMBAHKAN LINK LUPA PASSWORD */}
        <div className="text-sm text-center mt-4">
          <Link to="/lupa-password" className="text-purple-400 hover:text-purple-300">
            Lupa password?
          </Link>
        </div>

         <p className="mt-6 text-center text-sm text-gray-400">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;