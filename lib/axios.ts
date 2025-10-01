import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

type ApiErrorResponse = {
  message?: string;
  [key: string]: unknown;
};

type ResponseError = AxiosError<ApiErrorResponse>;

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://35.154.108.96:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token = '';

    const authCookie = Cookies.get('auth');
    if (authCookie) {
      try {
        const parsedAuth = JSON.parse(authCookie) as { token?: string };
        token = parsedAuth.token ?? '';
      } catch {
        token = Cookies.get('auth-token') ?? '';
      }
    } else {
      token = Cookies.get('auth-token') ?? '';
    }

    if (token) {
      config.headers = config.headers ?? ({} as typeof config.headers);
      config.headers['Authorization'] = `Bearer ${token}`;
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

  const message = String(error.response?.data?.message ?? '').toLowerCase();
  const url = error.config?.url ?? '';

  const criticalMessageKeywords = ['token', 'expired', 'invalid', 'authentication', 'session'];
  const criticalEndpoints = ['/auth/login', '/auth/profile', '/auth/refresh'];

  const messageIndicatesTokenIssue = criticalMessageKeywords.some((keyword) => message.includes(keyword));
  const endpointIndicatesCriticalFailure = criticalEndpoints.some((endpoint) => url.includes(endpoint));

  return messageIndicatesTokenIssue || endpointIndicatesCriticalFailure;
};

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: ResponseError) => {
    if (shouldForceLogout(error)) {
      Cookies.remove('auth');
      Cookies.remove('auth-token');
      Cookies.remove('institution-data');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
