import axios from 'axios';
import Cookies from 'js-cookie';

type RequestConfig = {
  headers?: Record<string, unknown>;
  [key: string]: unknown;
};

type ResponseError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
      [key: string]: unknown;
    };
  };
  config?: {
    url?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://35.154.108.96:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config: RequestConfig) => {
    const token = Cookies.get('auth-token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      (config.headers as Record<string, unknown>)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: ResponseError) => {
    return Promise.reject(error);
  }
);

const shouldForceLogout = (error: ResponseError): boolean => {
  const status = error.response?.status;
  if (status !== 401) {
    return false;
  }

  const message = String((error.response?.data?.message ?? '')).toLowerCase();
  const url = error.config?.url ?? '';

  const criticalMessageKeywords = ['token', 'expired', 'invalid', 'authentication', 'session'];
  const criticalEndpoints = ['/auth/login', '/auth/profile', '/auth/refresh'];

  const messageIndicatesTokenIssue = criticalMessageKeywords.some((keyword) => message.includes(keyword));
  const endpointIndicatesCriticalFailure = criticalEndpoints.some((endpoint) => url.includes(endpoint));

  return messageIndicatesTokenIssue || endpointIndicatesCriticalFailure;
};

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: unknown) => response,
  (error: ResponseError) => {
    if (shouldForceLogout(error)) {
      Cookies.remove('auth-token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
