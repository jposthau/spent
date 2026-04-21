import client from './client';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
}

export const listUsers = (): Promise<AdminUser[]> =>
  client.get<AdminUser[]>('/api/admin/users').then(r => r.data);

export const approveUser = (id: number): Promise<AdminUser> =>
  client.post<AdminUser>(`/api/admin/users/${id}/approve`).then(r => r.data);

export const denyUser = (id: number): Promise<AdminUser> =>
  client.post<AdminUser>(`/api/admin/users/${id}/deny`).then(r => r.data);
