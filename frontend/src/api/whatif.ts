import client from './client';
import type { WhatIfRequest, WhatIfResult } from '../types/whatif';

export const calculateWhatIf = (userId: number, data: WhatIfRequest) =>
  client.post<WhatIfResult>(`/api/users/${userId}/whatif`, data).then(r => r.data);
