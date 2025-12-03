import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  token_type: string;
}

const setAuthCookie = (token: string | null) => {
  if (typeof document === 'undefined') return;
  if (!token) {
    document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  } else {
    document.cookie = `auth_token=${token}; Path=/; SameSite=Lax`;
  }
};

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await api.post<{ data: LoginResponse }>('/auth/login', {
      email,
      password,
    });
    const { access_token, user } = response.data.data;
    localStorage.setItem('auth_token', access_token);
    setAuthCookie(access_token);
    return user;
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ data: User }>('/auth/me');
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      setAuthCookie(null);
    }
  },

  async updateProfile(data: { name?: string; email?: string }): Promise<User> {
    const response = await api.put<{ data: User }>('/auth/profile', data);
    return response.data.data;
  },

  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<void> {
    await api.post('/auth/change-password', data);
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },
};
