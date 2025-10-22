import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const { registerUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(username, email, password, password2);
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Username</label>
            <input type="text" name="username" required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
            <input type="password" name="password2" required value={password2} onChange={(e) => setPassword2(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200" />
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md">
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;