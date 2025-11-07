import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast'; 

function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(username, password);
      toast.success(t('loginSuccess'));
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">{t('login')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">{t('username')}</label>
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
            <label className="block text-sm font-medium text-gray-300">{t('password')}</label>
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
            disabled={loading} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? t('loading') : t('login')}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          <Link to="/lupa-password" className="text-purple-400 hover:text-purple-300">
            {t('forgotPassword')}
          </Link>
        </div>

         <p className="mt-6 text-center text-sm text-gray-400">
          {t('noAccount')}{' '}
          <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300">
            {t('registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;