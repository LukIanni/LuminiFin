import axios, { AxiosInstance } from "axios";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Carregar token do localStorage
    this.token = localStorage.getItem('authToken');
    this.updateAuthHeader();

    // Interceptor para adicionar token em todas as requisições
    this.client.interceptors.request.use((config: any) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Interceptor para lidar com erros 401
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  private updateAuthHeader() {
    if (this.token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/signup', data);
    this.setToken(response.data.token);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    this.setToken(response.data.token);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<User>('/auth/profile');
    return response.data;
  }

  async getExpenses() {
    const response = await this.client.get('/expenses');
    return response.data;
  }

  async createExpense(data: any) {
    const response = await this.client.post('/expenses', data);
    return response.data;
  }

  async deleteExpense(id: string) {
    const response = await this.client.delete(`/expenses/${id}`);
    return response.data;
  }

  async getGoals() {
    const response = await this.client.get('/goals');
    return response.data;
  }

  async createGoal(data: any) {
    const response = await this.client.post('/goals', data);
    return response.data;
  }

  async updateGoal(id: string, data: any) {
    const response = await this.client.put(`/goals/${id}`, data);
    return response.data;
  }

  async deleteGoal(id: string) {
    const response = await this.client.delete(`/goals/${id}`);
    return response.data;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
    this.updateAuthHeader();
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    this.updateAuthHeader();
  }
}

export const apiClient = new ApiClient();
