import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const StarIcon = ({ filled, onClick }) => (
  <svg 
    className={`w-10 h-10 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-600'}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
    onClick={onClick}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);

function ReviewPage() {
  const { purchaseId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [ulasan, setUlasan] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Mohon pilih rating bintang (1-5).');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      await apiClient.post(`/purchase/${purchaseId}/review/`, { rating, ulasan });
      alert('Ulasan Anda berhasil dikirim! Terima kasih.');
      navigate('/profil');
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Gagal mengirim ulasan.";
      setError(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Beri Ulasan</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rating Anda</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon 
                  key={star} 
                  filled={star <= rating} 
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Ulasan Anda (Opsional)</label>
            <textarea
              value={ulasan}
              onChange={(e) => setUlasan(e.target.value)}
              rows="4"
              className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-200"
              placeholder="Bagaimana pengalaman Anda dengan akun ini?"
            ></textarea>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewPage;