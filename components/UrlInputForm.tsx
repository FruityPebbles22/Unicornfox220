
import React, { useState } from 'react';

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!url || !youtubeRegex.test(url)) {
      setError('Please enter a valid YouTube URL.');
      return;
    }
    setError('');
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (error) setError('');
          }}
          placeholder="Paste a YouTube URL here..."
          className="w-full bg-gray-800 border-2 border-cyan-500 text-cyan-300 px-4 py-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200"
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm mt-1 absolute">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-fuchsia-600 text-white font-bold rounded-md text-xl hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-fuchsia-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-fuchsia-600/30"
      >
        {isLoading ? 'Generating...' : 'GENERATE'}
      </button>
    </form>
  );
};