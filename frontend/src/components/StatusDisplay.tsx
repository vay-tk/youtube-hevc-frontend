import React from 'react';
import { CheckCircle, AlertCircle, Loader2, Download, Clock, FileVideo, Image } from 'lucide-react';

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
}

interface StatusDisplayProps {
  status: 'processing' | 'ready' | 'error';
  message: string;
  taskId?: string;
  videoInfo?: VideoInfo;
  onDownload?: (taskId: string) => void;
  progress?: string;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  status,
  message,
  taskId,
  videoInfo,
  onDownload,
  progress
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
      case 'ready':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'ready':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getProgressSteps = () => {
    const steps = [
      { label: 'Extracting', active: false, completed: false },
      { label: 'Downloading', active: false, completed: false },
      { label: 'Converting', active: false, completed: false },
      { label: 'Ready', active: false, completed: false }
    ];

    if (status === 'ready') {
      steps.forEach(step => step.completed = true);
    } else if (status === 'processing') {
      const currentStep = progress?.toLowerCase() || 'extracting';
      let foundCurrent = false;
      
      steps.forEach(step => {
        if (step.label.toLowerCase() === currentStep) {
          step.active = true;
          foundCurrent = true;
        } else if (!foundCurrent) {
          step.completed = true;
        }
      });
    }

    return steps;
  };

  return (
    <div className={`border-2 rounded-2xl p-6 ${getStatusColor()} transition-all duration-200`}>
      <div className="flex items-center mb-4">
        {getStatusIcon()}
        <h3 className="text-lg font-semibold ml-3 text-gray-900">
          {status === 'processing' ? 'Processing Video' : 
           status === 'ready' ? 'Video Ready' : 
           'Error Occurred'}
        </h3>
      </div>

      {status === 'processing' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900 capitalize">{progress || 'Starting...'}</span>
          </div>
          <div className="flex space-x-2">
            {getProgressSteps().map((step, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.completed ? 'bg-green-500 text-white' :
                  step.active ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step.completed ? '✓' : index + 1}
                </div>
                <span className="text-xs text-gray-600 mt-1">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-gray-700 mb-4">{message}</p>

      {videoInfo && (
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {videoInfo.thumbnail ? (
                <img 
                  src={videoInfo.thumbnail} 
                  alt={videoInfo.title}
                  className="w-24 h-18 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-18 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Image className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{videoInfo.title}</h4>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {videoInfo.duration}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FileVideo className="w-4 h-4 mr-1" />
                  720p HEVC
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'ready' && taskId && onDownload && (
        <button
          onClick={() => onDownload(taskId)}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 flex items-center justify-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Video
        </button>
      )}
    </div>
  );
};

export default StatusDisplay;