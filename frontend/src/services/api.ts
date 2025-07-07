const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export interface DownloadRequest {
  url: string;
  rename?: string;
}

export interface DownloadResponse {
  taskId: string;
  status: string;
  message: string;
}

export interface StatusResponse {
  status: 'processing' | 'ready' | 'error';
  filename?: string;
  message?: string;
  videoInfo?: {
    title: string;
    thumbnail: string;
    duration: string;
  };
  progress?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const error = await response.json();
          errorMessage = error.detail || error.message || errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server');
      }
      throw error;
    }
  }

  async uploadCookies(file: File): Promise<{ message: string }> {
    try {
      const formData = new FormData();
      formData.append('cookies', file);

      const response = await fetch(`${API_BASE_URL}/api/upload-cookies`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.detail || error.message || errorMessage;
        } catch {
          // Use default error message
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to upload cookies');
      }
      throw error;
    }
  }

  async startDownload(data: DownloadRequest): Promise<DownloadResponse> {
    return this.request<DownloadResponse>('/api/download', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getStatus(taskId: string): Promise<StatusResponse> {
    return this.request<StatusResponse>(`/api/status/${taskId}`);
  }

  getDownloadUrl(taskId: string): string {
    return `${API_BASE_URL}/files/${taskId}.mkv`;
  }

  async downloadFile(taskId: string): Promise<void> {
    try {
      const url = this.getDownloadUrl(taskId);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${taskId}.mkv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to download file');
      }
      throw error;
    }
  }

  async healthCheck(): Promise<{ message: string; status: string }> {
    return this.request<{ message: string; status: string }>('/health');
  }

  async cleanup(taskId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/cleanup/${taskId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();