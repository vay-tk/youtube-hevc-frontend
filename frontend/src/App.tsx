import React from 'react';
import { useDownload } from './hooks/useDownload';
import DownloadForm from './components/DownloadForm';
import StatusDisplay from './components/StatusDisplay';
import ErrorDisplay from './components/ErrorDisplay';

function App() {
  const {
    isProcessing,
    currentTask,
    status,
    error,
    uploadCookies,
    startDownload,
    downloadFile,
    reset,
  } = useDownload();

  const handleDownload = async (url: string, rename?: string) => {
    await startDownload(url, rename);
  };

  const handleCookiesUpload = async (file: File) => {
    await uploadCookies(file);
  };

  const handleFileDownload = (taskId: string) => {
    downloadFile(taskId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <DownloadForm
            onDownload={handleDownload}
            onCookiesUpload={handleCookiesUpload}
            isProcessing={isProcessing}
          />

          {error && (
            <ErrorDisplay
              message={error}
              onRetry={reset}
            />
          )}

          {status && (
            <StatusDisplay
              status={status.status}
              message={status.message || 'Processing your request...'}
              taskId={currentTask || undefined}
              videoInfo={status.videoInfo}
              onDownload={handleFileDownload}
              progress={status.progress}
            />
          )}

          {!isProcessing && !status && !error && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium text-gray-400">Enter a YouTube URL to get started</p>
                <p className="text-sm text-gray-400 mt-2">Videos will be converted to 720p HEVC format</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Features</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    720p HEVC (H.265) encoding
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    96kbps AAC audio
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Cookie support for private videos
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Custom filename support
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="text-center py-8 text-sm text-gray-500">
        <p>⚠️ For personal and educational use only. Please respect YouTube's terms of service.</p>
      </footer>
    </div>
  );
}

export default App;