import React, { useState } from 'react';
import { Download, Upload, Link, Edit3 } from 'lucide-react';

interface DownloadFormProps {
  onDownload: (url: string, rename?: string) => void;
  onCookiesUpload: (file: File) => void;
  isProcessing: boolean;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ onDownload, onCookiesUpload, isProcessing }) => {
  const [url, setUrl] = useState('');
  const [rename, setRename] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [cookiesUploaded, setCookiesUploaded] = useState(false);
  const [urlError, setUrlError] = useState('');

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setUrlError('Please enter a YouTube URL');
      return;
    }
    if (!validateYouTubeUrl(url)) {
      setUrlError('Please enter a valid YouTube URL');
      return;
    }
    setUrlError('');
    onDownload(url, rename || undefined);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.name.endsWith('.txt')) {
      onCookiesUpload(file);
      setCookiesUploaded(true);
    } else {
      alert('Please upload a .txt file');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">YouTube HEVC Downloader</h1>
        <p className="text-gray-600">Download videos in high-quality 720p HEVC format</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            YouTube URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                urlError ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isProcessing}
            />
          </div>
          {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
        </div>

        <div>
          <label htmlFor="rename" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Filename (optional)
          </label>
          <div className="relative">
            <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="rename"
              value={rename}
              onChange={(e) => setRename(e.target.value)}
              placeholder="my_video.mkv"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isProcessing}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cookies File (optional)
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
              dragOver
                ? 'border-blue-500 bg-blue-50'
                : cookiesUploaded
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300'
            }`}
          >
            <input
              type="file"
              accept=".txt"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            <Upload className={`w-8 h-8 mx-auto mb-2 ${
              cookiesUploaded ? 'text-green-500' : 'text-gray-400'
            }`} />
            <p className={`text-sm ${
              cookiesUploaded ? 'text-green-600' : 'text-gray-600'
            }`}>
              {cookiesUploaded ? 'Cookies uploaded successfully' : 'Drop cookies.txt here or click to upload'}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Download Video'}
        </button>
      </form>
    </div>
  );
};

export default DownloadForm;