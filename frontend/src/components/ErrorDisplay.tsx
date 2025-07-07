import React from 'react';
import { XCircle, RefreshCw, Upload, AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  const isYouTubeBlocking = message.includes('Sign in to confirm') || 
                           message.includes('not a bot') || 
                           message.includes('YouTube is blocking') ||
                           message.includes('access blocked');
  
  const isAccessForbidden = message.includes('Access forbidden') || 
                           message.includes('403') ||
                           message.includes('region-locked');
  
  const isPrivateVideo = message.includes('private video') || 
                        message.includes('Private video');

  const getSuggestion = () => {
    if (isYouTubeBlocking || isAccessForbidden || isPrivateVideo) {
      return (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <Upload className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Try uploading cookies.txt</h4>
              <p className="text-sm text-blue-700 mb-3">
                To access private, age-restricted, or region-locked videos, you can upload a cookies.txt file from your browser:
              </p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Install a browser extension like "Get cookies.txt LOCALLY"</li>
                <li>Go to YouTube and sign in to your account</li>
                <li>Export cookies for youtube.com as cookies.txt</li>
                <li>Upload the file using the form above</li>
                <li>Try downloading again</li>
              </ol>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <XCircle className="w-6 h-6 text-red-500" />
        <h3 className="text-lg font-semibold ml-3 text-red-900">Download Failed</h3>
      </div>
      
      <div className="text-red-700 mb-4 whitespace-pre-line">{message}</div>
      
      {getSuggestion()}
      
      <div className="flex items-center justify-between mt-6">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <AlertTriangle className="w-4 h-4 mr-1" />
          <span>If issues persist, try a different video or check the URL</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
