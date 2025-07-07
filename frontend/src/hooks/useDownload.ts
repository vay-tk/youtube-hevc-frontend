import { useState, useCallback, useRef } from 'react';
import { apiService, DownloadRequest, StatusResponse } from '../services/api';

export const useDownload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const startPolling = useCallback((taskId: string) => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }

    pollingInterval.current = setInterval(async () => {
      try {
        const statusResponse = await apiService.getStatus(taskId);
        setStatus(statusResponse);
        
        if (statusResponse.status === 'ready' || statusResponse.status === 'error') {
          setIsProcessing(false);
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
          }
        }
      } catch (err) {
        console.error('Status polling error:', err);
        setError(err instanceof Error ? err.message : 'Status check failed');
        setIsProcessing(false);
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
      }
    }, 3000); // Poll every 3 seconds
  }, []);

  const uploadCookies = useCallback(async (file: File) => {
    try {
      await apiService.uploadCookies(file);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cookie upload failed');
      return false;
    }
  }, []);

  const startDownload = useCallback(async (url: string, rename?: string) => {
    setIsProcessing(true);
    setError(null);
    setStatus(null);

    try {
      const request: DownloadRequest = { url };
      if (rename) request.rename = rename;

      const response = await apiService.startDownload(request);
      setCurrentTask(response.taskId);
      setStatus({ status: 'processing', message: response.message });
      
      // Start polling for status updates
      startPolling(response.taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed to start');
      setIsProcessing(false);
    }
  }, [startPolling]);

  const downloadFile = useCallback(async (taskId: string) => {
    try {
      await apiService.downloadFile(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  }, []);

  const reset = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
    setIsProcessing(false);
    setCurrentTask(null);
    setStatus(null);
    setError(null);
  }, []);

  return {
    isProcessing,
    currentTask,
    status,
    error,
    uploadCookies,
    startDownload,
    downloadFile,
    reset,
  };
};