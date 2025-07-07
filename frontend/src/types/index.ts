export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
}

export interface DownloadTask {
  id: string;
  url: string;
  status: 'processing' | 'ready' | 'error';
  progress?: string;
  videoInfo?: VideoInfo;
  filename?: string;
  createdAt: Date;
}

export interface ApiError {
  message: string;
  details?: string;
}