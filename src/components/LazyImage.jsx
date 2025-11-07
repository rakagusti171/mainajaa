import React, { useState } from 'react';

const LazyImage = ({ src, alt, className, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  const handleLoad = () => {
    setImageLoaded(true);
  };

  if (imageError) {
    return (
      <div className={`bg-gray-700 flex items-center justify-center ${className}`} {...props}>
        <span className="text-gray-500 text-xs">Gambar tidak tersedia</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
          <span className="text-gray-500 text-xs">Memuat...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;

