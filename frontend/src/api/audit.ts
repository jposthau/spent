import client from './client';
import type { AuditSummary } from '../types/audit';

export const getAudit = (userId: number) =>
  client.get<AuditSummary>(`/api/users/${userId}/audit`).then(r => r.data);

export const getNarrative = (userId: number) =>
  client.post<string>(`/api/users/${userId}/audit/narrative`, null, {
    headers: { Accept: 'text/plain' },
    responseType: 'text',
  }).then(r => r.data);
