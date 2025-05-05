import React, { useState, useEffect } from 'react';

const ImageUploader = ({ onImageUploaded, userId }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Cloudinary script
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up script when component unmounts
      const scriptElement = document.querySelector('script[src="https://widget.cloudinary.com/v2.0/global/all.js"]');
      if (scriptElement) document.body.removeChild(scriptElement);
    };
  }, []);

  const openUploadWidget = () => {
    if (!window.cloudinary) {
      setError('Cloudinary widget is still loading. Please try again in a moment.');
      return;
    }
    
    setUploading(true);
    setError('');
    setProgress(0);
    
    const uploadOptions = {
      cloudName: 'dwnwfmlsw', // Replace with your Cloudinary cloud name
      uploadPreset: 'Image_upload', // Replace with your upload preset
      folder: `images/${userId || 'anonymous'}`,
      multiple: false,
      sources: ['local', 'camera', 'url'],
      tags: [`user_${userId || 'anonymous'}`],
      clientAllowedFormats: ['image'],
      maxFileSize: 5000000, // 5MB max file size
    };
    
    const uploadWidget = window.cloudinary.createUploadWidget(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Upload error:', error);
          setError('Upload failed: ' + error.message);
          setUploading(false);
          return;
        }
        
        if (result && result.event === 'success') {
          // Get the secure URL of the uploaded image
          const imageUrl = result.info.secure_url;
          onImageUploaded(imageUrl);
          setUploading(false);
          setProgress(0);
        } else if (result && result.event === 'close') {
          // Widget was closed without completing upload
          setUploading(false);
        } else if (result && result.event === 'progress') {
          // Update progress if available
          if (result.info && result.info.progress) {
            setProgress(Math.round(result.info.progress * 100));
          }
        }
      }
    );
    
    uploadWidget.open();
  };

  return (
    <div className="mb-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex items-center">
        <button
          type="button"
          onClick={openUploadWidget}
          disabled={uploading}
          className="flex items-center cursor-pointer px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          <svg 
            className="w-5 h-5 mr-2 text-gray-700" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <span className="text-gray-700">{uploading ? 'Uploading...' : 'Add Image'}</span>
        </button>
      </div>

      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Uploading: {progress}%</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;