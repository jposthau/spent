import client from './client';
import type { User, CreateUserRequest } from '../types/user';

export const createUser = (data: CreateUserRequest) =>
  client.post<User>('/api/users', data).then(r => r.data);

export const getUser = (id: number) =>
  client.get<User>(`/api/users/${id}`).then(r => r.data);

export const updateUser = (id: number, data: CreateUserRequest) =>
  client.put<User>(`/api/users/${id}`, data).then(r => r.data);
