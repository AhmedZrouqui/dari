// lib/api.ts - API Client refactorisé
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';

// API response types
interface ApiError {
  message: string;
  status: number;
  code?: string;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

interface QueueItem {
  resolve: (value: AxiosResponse) => void;
  reject: (error: unknown) => void;
  request: RetryableRequestConfig;
}

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Utility functions for cookie management
export const setAuthCookies = async (
  token: string,
  refreshToken: string
): Promise<void> => {
  try {
    await fetch('/api/auth/set-cookies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, refreshToken }),
    });
  } catch (error) {
    console.error('Failed to set auth cookies:', error);
  }
};

export const clearAuthCookies = async (): Promise<void> => {
  try {
    await fetch('/api/auth/clear-cookies', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Failed to clear auth cookies:', error);
  }
};

class ApiClient {
  private instance;
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];

  constructor() {
    this.instance = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important: envoie automatiquement les cookies
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - plus besoin d'ajouter manuellement le token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // Les cookies sont automatiquement inclus grâce à withCredentials: true

        if (process.env.NODE_ENV === 'development') {
          console.log(
            `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
          );
        }

        return config;
      },
      (error: AxiosError): Promise<never> => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `✅ API Response: ${response.status} ${response.config.url}`
          );
        }
        return response;
      },
      async (error: AxiosError): Promise<AxiosResponse> => {
        const originalRequest = error.config as RetryableRequestConfig;

        if (!error.response) {
          console.error('Network error:', error.message);
          throw new Error('Network error. Please check your connection.');
        }

        const { status } = error.response;

        switch (status) {
          case 401:
            return this.handle401Error(originalRequest, error);
          case 403:
            console.error('Access forbidden:', error.response.data);
            throw this.createApiError('Access forbidden', status);
          case 404:
            console.error('Resource not found:', error.response.data);
            throw this.createApiError('Resource not found', status);
          case 429:
            console.error('Rate limit exceeded:', error.response.data);
            throw this.createApiError(
              'Too many requests. Please try again later.',
              status
            );
          case 500:
          case 502:
          case 503:
          case 504:
            console.error('Server error:', error.response.data);
            throw this.createApiError(
              'Server error. Please try again later.',
              status
            );
          default:
            console.error('API error:', error.response.data);
            const errorMessage = this.extractErrorMessage(error.response.data);
            throw this.createApiError(errorMessage, status);
        }
      }
    );
  }

  private extractErrorMessage(data: unknown): string {
    if (typeof data === 'object' && data !== null) {
      const errorData = data as Record<string, unknown>;
      if (typeof errorData.message === 'string') {
        return errorData.message;
      }
    }
    return 'An unexpected error occurred';
  }

  private async handle401Error(
    originalRequest: RetryableRequestConfig,
    error: AxiosError
  ): Promise<AxiosResponse> {
    void error;

    // Si c'est déjà un retry, on logout
    if (originalRequest._retry) {
      await this.handleLogout();
      throw this.createApiError('Session expired. Please login again.', 401);
    }

    // Si on est déjà en train de refresh, on met en queue
    if (this.isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        this.failedQueue.push({ resolve, reject, request: originalRequest });
      });
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      // Tentative de refresh du token - les cookies sont automatiquement envoyés
      const refreshResponse = await this.instance.post<RefreshTokenResponse>(
        '/auth/refresh'
      );
      const { token, refreshToken } = refreshResponse.data;

      // Mise à jour des cookies
      await setAuthCookies(token, refreshToken);

      // Traitement de la queue
      await this.processQueue(null);

      // Retry de la requête originale
      return this.instance(originalRequest);
    } catch (refreshError) {
      await this.processQueue(refreshError);
      await this.handleLogout();
      throw this.createApiError('Session expired. Please login again.', 401);
    } finally {
      this.isRefreshing = false;
    }
  }

  private async processQueue(error: unknown): Promise<void> {
    const promises = this.failedQueue.map(
      async ({ resolve, reject, request }) => {
        try {
          if (error) {
            reject(error);
          } else {
            const response = await this.instance(request);
            resolve(response);
          }
        } catch (requestError) {
          reject(requestError);
        }
      }
    );

    this.failedQueue = [];
    await Promise.allSettled(promises);
  }

  private async handleLogout(): Promise<void> {
    // Clear cookies côté serveur
    await clearAuthCookies();

    // Redirection - le middleware se chargera du reste
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  private createApiError(
    message: string,
    status: number,
    code?: string
  ): ApiError {
    return { message, status, code };
  }

  // Public methods
  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  getInstance() {
    return this.instance;
  }
}

const apiClient = new ApiClient();
export default apiClient;
export { ApiClient };
export type { ApiError, ApiResponse };
