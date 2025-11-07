import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4">Oops! Terjadi Kesalahan</h1>
            <p className="text-gray-400 mb-6">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan refresh halaman atau kembali ke halaman utama.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-md"
              >
                Refresh Halaman
              </button>
              <a
                href="/"
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md text-center"
              >
                Kembali ke Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

