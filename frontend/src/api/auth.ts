import client from './client';
import type { AuthUser } from '../types/auth';

export const getMe = (): Promise<AuthUser> =>
  client.get<AuthUser>('/api/auth/me').then(r => r.data);

export const logout = (): Promise<void> =>
  client.post('/api/auth/logout').then(() => undefined);

export const login = (email: string, password: string): Promise<AuthUser> =>
  client.post<AuthUser>('/api/auth/login', { email, password }).then(r => r.data);

export const register = (email: string, password: string): Promise<{ message: string }> =>
  client.post<{ message: string }>('/api/auth/register', { email, password }).then(r => r.data);
