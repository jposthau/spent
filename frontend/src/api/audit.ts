import client from './client';
import type { AuditSummary } from '../types/audit';

export const getAudit = (userId: number) =>
  client.get<AuditSummary>(`/api/users/${userId}/audit`).then(r => r.data);
